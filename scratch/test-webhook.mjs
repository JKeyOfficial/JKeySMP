import fetch from 'node-fetch';
import crypto from 'crypto';

// This script simulates a Stripe webhook call for testing purposes.
// You need to run this with 'node test-webhook.mjs'

const WEBHOOK_SECRET = 'whsec_...'; // Must match your .env.local
const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/stripe';

const payload = JSON.stringify({
  id: 'evt_test',
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_123',
      metadata: {
        minecraft_username: 'Notch',
        item_id: 'rank_vip'
      }
    }
  }
});

const timestamp = Math.floor(Date.now() / 1000);
const signaturePayload = `${timestamp}.${payload}`;
const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
const signature = hmac.update(signaturePayload).digest('hex');

const stripeSignature = `t=${timestamp},v1=${signature}`;

async function test() {
  console.log('Sending test webhook to:', WEBHOOK_URL);
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': stripeSignature
      },
      body: payload
    });

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
