# Query: What's the code to verify Stripe webhook signatures in Node.js?

**Tool:** webresearcher --effort low
**Latency:** 10s

## Tokens
- Input: 8212
- Output: 520

## Cost
$0.0217

## Response

In Node.js, Stripe recommends verifying webhook signatures by passing **the raw request body**, the `Stripe-Signature` header, and your endpoint's signing secret (`whsec_...`) into `stripe.webhooks.constructEvent(...)`. ([docs.stripe.com](https://docs.stripe.com/webhooks/signature?utm_source=openai))

### Express example (recommended pattern)

```js
import express from "express";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // starts with "whsec_"

// IMPORTANT: use express.raw() ONLY for this route
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      // SignatureVerificationError (or other) -> reject
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ event is verified
    switch (event.type) {
      case "payment_intent.succeeded":
        // const paymentIntent = event.data.object;
        break;
      default:
        break;
    }

    res.sendStatus(200);
  }
);

// Make sure this is AFTER the webhook route:
// app.use(express.json());

app.listen(4242);
```

Key gotcha: **don't JSON-parse the body before verification**—`constructEvent` needs the *exact raw bytes* Stripe sent. ([docs.stripe.com](https://docs.stripe.com/webhooks/signature?utm_source=openai))

If you tell me your framework/runtime (Express, Next.js, AWS Lambda/API Gateway, Cloudflare Workers, etc.), I can tailor the exact "raw body" handling snippet for it.
