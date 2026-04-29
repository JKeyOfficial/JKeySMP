import { NextResponse } from "next/server";
import Stripe from "stripe";
import { storeItems, rankPriority } from "@/config/store";
import { getUserGroups } from "@/lib/minecraft";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia" as any,
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

    // Dynamic Upgrade Logic
    const groups = await getUserGroups(username);
    const currentRankLevel = Math.max(...groups.map(g => rankPriority[g] || 0));
    const targetRankName = item.id.replace("rank_", "");
    const targetRankLevel = rankPriority[targetRankName] || 0;

    // Prevent downgrades or duplicate purchases at the API level
    if (currentRankLevel >= targetRankLevel) {
      return NextResponse.json({ error: "You already own this rank or a higher one" }, { status: 400 });
    }

    let finalPrice = item.price;
    if (currentRankLevel > 0) {
      const currentRankKey = Object.keys(rankPriority).find(k => rankPriority[k] === currentRankLevel);
      const currentRankItem = storeItems.find(i => i.id === `rank_${currentRankKey}`);
      if (currentRankItem) {
        finalPrice = Math.max(0, item.price - currentRankItem.price);
      }
    }

    const isUpgrade = finalPrice < item.price;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: isUpgrade ? `Rank Upgrade: ${item.name}` : item.name,
              description: isUpgrade ? `Upgrading from your current rank to ${item.name}` : item.description,
            },
            unit_amount: finalPrice,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}?success=true`,
      cancel_url: `${appUrl}?canceled=true`,
      metadata: {
        minecraft_username: username,
        item_id: item.id,
        is_upgrade: (finalPrice < item.price).toString()
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
