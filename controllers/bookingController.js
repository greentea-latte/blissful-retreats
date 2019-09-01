const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Retreat = require('../models/retreatModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsyncErr = require('../utils/catchAsyncErr');
const factory = require('./factoryController');

exports.getCheckoutSession = catchAsyncErr(async (req, res, next) => {
  // 1) Get the currently booked retreat
  const retreat = await Retreat.findById(req.params.retreatId);
  console.log(retreat);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.retreatId,
    customer_email: req.user.email,
    client_reference_id: req.params.retreatId,
    line_items: [
      {
        name: `${retreat.name} retreat`,
        description: retreat.summary,
        amount: retreat.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

const createBookingCheckout = async session => {
  const retreat = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items[0].amount / 100;
  await Booking.create({ retreat, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
