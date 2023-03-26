const express = require('express');
const uuid = require('uuid');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const PORT = process.env.PORT || 4040;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'http://127.0.0.1:5500',
  })
);

app.post('/api/checkout', async (req, res) => {
  try {
    let { name, phoneNo, address, amount } = req.body;

    if (!(name && phoneNo && address && amount)) {
      throw new Error('Please provide all the details');
    }

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
      throw new Error('Amount should be a positive value');
    }

    const [street, city, postalCode, state, country] = address.split(', ');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
      description: 'Test transaction',
      metadata: {
        date: new Date(),
        receipt: uuid.v4(),
      },
      shipping: {
        address: {
          line1: street,
          city,
          state,
          country,
          postal_code: postalCode,
        },
        name,
        phone: phoneNo,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
