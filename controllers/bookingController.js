const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Retreat = require('../models/retreatModel');
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



exports.createBookingCheckout = catchAsyncErr(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { retreat, user, price } = req.query;

  if (!retreat && !user && !price) return next();
  await Booking.create({ retreat, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
