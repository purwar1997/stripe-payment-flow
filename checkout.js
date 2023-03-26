const stripe = Stripe(
  'pk_test_51Moj99SDjUhTdjnAXugjXuuhqzYC9Z4VLDQXv9JCO0nqHfh2Q40Wnhz5D4UECQUObWbA2l9IR83bhh4smEcZ78XI00QDJr7pU5'
);

const inputForm = document.querySelector('#input-form');
const paymentForm = document.querySelector('#payment-form');

paymentForm.style.display = 'none';

inputForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const name = document.querySelector('#name').value;
  const phoneNo = document.querySelector('#phone').value;
  const address = document.querySelector('#address').value;
  const amount = document.querySelector('#amount').value;

  const response = await fetch('http://localhost:4040/api/checkout', {
    method: 'POST',
    body: JSON.stringify({
      name,
      phoneNo,
      address,
      amount,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { clientSecret } = await response.json();

  const options = {
    clientSecret,
    appearance: {},
  };

  const elements = stripe.elements(options);

  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');

  this.style.display = 'none';
  paymentForm.style.display = 'block';
});

paymentForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: 'http://127.0.0.1:5500/checkout.html',
    },
  });

  if (error) {
    const message = document.querySelector('#error-message');
    message.innerText = error.message;
  }
});
