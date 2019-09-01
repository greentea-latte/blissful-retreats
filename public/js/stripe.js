/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookRetreat = async retreatId => {
const stripe = Stripe('pk_test_V0rfzYVORTmkHIWIwq1Eger800b1i98xvO');

  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${retreatId}`
    );
    console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
