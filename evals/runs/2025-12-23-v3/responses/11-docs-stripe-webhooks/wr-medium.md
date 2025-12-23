# Query: What's the code to verify Stripe webhook signatures in Node.js?

**Tool:** webresearcher --effort medium
**Latency:** 13s

## Tokens
- Input: 8506
- Output: 773

## Cost
$0.0257

## Response

Here's the canonical Stripe webhook signature verification pattern in **Node.js (Express)**: use the **raw request body** and `stripe.webhooks.constructEvent(...)`. ([docs.stripe.com](https://docs.stripe.com/webhooks/signatures?utm_source=openai))

```js
// server.js
const express = require("express");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // sk_...
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // whsec_...

const app = express();

// IMPORTANT: this route must use the RAW body (Buffer), not express.json()
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      // Signature verification failed
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Signature verified; handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        // ...your logic...
        break;
      }
      default:
        // Unexpected event type
        break;
    }

    res.json({ received: true });
  }
);

// If you also need JSON parsing for other routes,
// add express.json() AFTER the webhook route.
app.use(express.json());

app.listen(4242, () => console.log("Listening on port 4242"));
```

Key gotchas:
- **Don't** use `express.json()` (or any JSON/body parser) on the webhook route before verification—Stripe requires the **exact raw payload**. ([docs.stripe.com](https://docs.stripe.com/webhooks/signature?utm_source=openai))
- The `endpointSecret` is your webhook signing secret (`whsec_...`) from the Dashboard or Stripe CLI. ([docs.stripe.com](https://docs.stripe.com/webhooks/signature?utm_source=openai))

If you tell me your framework (Express / Fastify / Next.js / AWS Lambda), I can paste the exact working version for that environment.
