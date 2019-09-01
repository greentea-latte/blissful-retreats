const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  retreat: {
    type: mongoose.Schema.ObjectId,
    ref: 'Retreat',
    required: [true, 'Booking must belong to a retreat!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

// populate retreat and user automatically when theres a query

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'retreat',
    select: 'name'
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
