# Query: What's the code to verify Stripe webhook signatures in Node.js?

**Tool:** WebSearch
**Latency:** 2.5s

## Response

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
