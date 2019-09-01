const Retreat = require('./../models/retreatModel');
const factory = require('./factoryController');
const catchAsyncErr = require('./../utils/catchAsyncErr');
const AppError = require('./../utils/appError');

exports.getAllRetreats = factory.getAll(Retreat);
exports.getRetreat = factory.getOne(Retreat, { path: 'reviews' });
exports.createRetreat = factory.createOne(Retreat);
exports.updateRetreat = factory.updateOne(Retreat);
exports.deleteRetreat = factory.deleteOne(Retreat);
