const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const retreatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A retreat must have a name'],
      unique: true,
      trim: true
    },
    ratingsTotal: {
      type: Number,
      default: 0
    },
    ratingsAverage: {
      type: Number,
      default: 3.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    price: {
      type: Number,
      required: [true, 'A retreat must have a price']
    },
    duration: {
      type: Number,
      required: [true, 'A retreat must have a duration']
    },
    capacity: {
      type: Number,
      required: [true, 'A retreat must have capacity']
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A retreat must have a summary']
    },
    details: {
      type: String,
      trim: true
    },
    imageMain: {
      type: String
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDate: [Date],
    location: {
      // Geospacial JSON, we need type and coordinates
      coordinates: [Number], // longitude, latitude
      address: String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate
retreatSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'retreat',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
retreatSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
// retreatSchema.pre('find', function(next) {
retreatSchema.pre(/^find/, function(next) {
  this.find({ secretRetreat: { $ne: true } });

  this.start = Date.now();
  next();
});

retreatSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

retreatSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Retreat = mongoose.model('Retreat', retreatSchema);

module.exports = Retreat;
