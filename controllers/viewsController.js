const Retreat = require('../models/retreatModel');
const User = require('../models/userModel');
const catchAsyncErr = require('../utils/catchAsyncErr');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

exports.getOverview = catchAsyncErr(async (req, res, next) => {
  // 1) Get retreat data from collection
  const retreats = await Retreat.find();

  // 2) Build template
  // 3) Render that template using retreat data from 1)
  res.status(200).render('overview', {
    title: 'All Retreats',
    retreats
  });
});

exports.getRetreat = catchAsyncErr(async (req, res, next) => {
  // 1) Get the data, for the requested retreat (including reviews and guides)
  const retreat = await Retreat.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!retreat) {
    return next(new AppError('There is no retreat with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('retreat', {
    title: `${retreat.name} retreat`,
    retreat
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getMyRetreats = catchAsyncErr(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const retreatIDs = bookings.map(el => el.retreats);
  const retreats = await Retreat.find({ _id: { $in: retreatIDs } });

  res.status(200).render('overview', {
    title: 'My retreats',
    retreats
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsyncErr(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
