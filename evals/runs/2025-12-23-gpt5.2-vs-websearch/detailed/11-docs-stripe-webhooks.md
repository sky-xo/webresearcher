# Query 11: What's the code to verify Stripe webhook signatures in Node.js?

**Type:** docs

## Response A (WebSearch)

```javascript
const stripe = require('stripe')('sk_test_...');
const endpointSecret = 'whsec_...';
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (req, res) => {
  let event;
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  res.json({received: true});
});
```

### Important Considerations
1. Stripe requires the raw body for signature verification
2. Any manipulation to raw body causes verification to fail
3. Stripe signs test and live events with different secrets

## Response B (webresearcher)

```js
const express = require("express");
const Stripe = require("stripe");

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // starts with "whsec_..."

// IMPORTANT: this route must use the *raw* request body (NOT express.json()).
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.sendStatus(400);
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

app.listen(4242, () => console.log("Listening on port 4242"));
```

Notes:
- Stripe signature verification requires the raw request body
- The verification call is `stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)`

## Judgment

**Winner:** B (webresearcher)
**Reasoning:** Response B uses modern best practices: environment variables for secrets, `express.raw()` instead of deprecated `bodyParser`, cleaner initialization with `new Stripe()`, includes a complete working server with event handling examples, and has clearer inline comments.

## Metrics

| Metric | webresearcher | WebSearch |
|--------|---------------|-----------|
| Latency | 28202ms | ~2500ms |
