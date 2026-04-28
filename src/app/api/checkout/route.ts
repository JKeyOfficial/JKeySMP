import { NextResponse } from "next/server";
import Stripe from "stripe";
import { storeItems } from "@/config/store";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: Request) {
  try {
    const { itemId, username } = await req.json();

    if (!itemId || !username) {
      return NextResponse.json({ error: "Missing itemId or username" }, { status: 400 });
    }

    const item = storeItems.find((i) => i.id === itemId);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: item.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/store?success=true`,
      cancel_url: `${appUrl}/store?canceled=true`,
      metadata: {
        minecraft_username: username,
        item_id: item.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
