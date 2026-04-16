const { HttpError } = require('../utils/httpError');

function notFound(req, res, next) {
  next(new HttpError(404, 'Not Found'));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err instanceof HttpError ? err.message : 'Internal Server Error';

  const payload = {
    error: {
      message
    }
  };

  if (err instanceof HttpError && err.details !== undefined) {
    payload.error.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production' && status === 500) {
    payload.error.debug = {
      name: err.name,
      message: err.message,
      stack: err.stack
    };
  }

  res.status(status).json(payload);
}

module.exports = { notFound, errorHandler };

