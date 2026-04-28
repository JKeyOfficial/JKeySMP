import { NextResponse } from "next/server";
import Stripe from "stripe";
import { storeItems } from "@/config/store";
import { executeRconCommand } from "@/lib/rcon";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const username = session.metadata?.minecraft_username;
    const itemId = session.metadata?.item_id;

    if (username && itemId) {
      const item = storeItems.find((i) => i.id === itemId);
      
      if (item) {
        // Execute the RCON command
        const command = item.command.replace("{player}", username);
        const success = await executeRconCommand(command);
        
        if (success) {
          console.log(`Successfully granted ${item.name} to ${username}`);
        } else {
          console.error(`Failed to grant ${item.name} to ${username} via RCON`);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
