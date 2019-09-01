module.exports = fn => {
  // express will call below function when new tour created with createTour handler
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err));
  };
};
