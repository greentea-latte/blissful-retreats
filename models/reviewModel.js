const mongoose = require('mongoose');
const Retreat = require('./retreatModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    retreat: {
      type: mongoose.Schema.ObjectId,
      ref: 'Retreat',
      required: [true, 'Review must belong to a retreat.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// each combination of tour and user is unique
reviewSchema.index({ retreat: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'retreat',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name photo'
  });

  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.retreat);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
