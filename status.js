const stripe = Stripe(
  'pk_test_51Moj99SDjUhTdjnAXugjXuuhqzYC9Z4VLDQXv9JCO0nqHfh2Q40Wnhz5D4UECQUObWbA2l9IR83bhh4smEcZ78XI00QDJr7pU5'
);

const paymentIntentId = new URLSearchParams(window.location.search).get('payment_intent');
const { paymentIntent } = await stripe.retrievePaymentIntent(paymentIntentId);

const message = document.querySelector('#message');

switch (paymentIntent.status) {
  case 'succeeded':
    message.innerText = 'Success! Payment received.';
    break;

  case 'processing':
    message.innerText = "Payment processing. We'll update you when payment is received.";
    break;

  case 'requires_payment_method':
    message.innerText = 'Payment failed. Please try another payment method.';
    break;

  default:
    message.innerText = 'Something went wrong.';
    break;
}
