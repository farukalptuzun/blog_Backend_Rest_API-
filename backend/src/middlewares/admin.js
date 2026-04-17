const { HttpError } = require('../utils/httpError');

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new HttpError(403, 'Forbidden'));
  }
  return next();
}

module.exports = { requireAdmin };

