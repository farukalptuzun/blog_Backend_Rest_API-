const jwt = require('jsonwebtoken');

const { env } = require('../config/env');
const { HttpError } = require('../utils/httpError');
const { User } = require('../models/User');

function getBearerToken(req) {
  const header = req.headers.authorization;
  if (!header) return null;
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token;
}

async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) throw new HttpError(401, 'Unauthorized');

    const payload = jwt.verify(token, env.jwtAccessSecret);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) throw new HttpError(401, 'Unauthorized');

    req.user = user;
    next();
  } catch (err) {
    next(new HttpError(401, 'Unauthorized'));
  }
}

module.exports = { requireAuth };

