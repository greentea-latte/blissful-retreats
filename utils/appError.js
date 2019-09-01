class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // when new obj created, constructor function is called
    // functon call won't appear in stack tray and pollute
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
