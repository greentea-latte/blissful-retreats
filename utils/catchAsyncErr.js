module.exports = fn => {
  // express will call below function when new retreat created with createRetreat handler
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err));
  };
};
