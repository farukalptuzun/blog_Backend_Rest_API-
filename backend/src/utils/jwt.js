const jwt = require('jsonwebtoken');

const { env } = require('../config/env');

function signAccessToken(userId) {
  return jwt.sign({ sub: String(userId) }, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiresIn });
}

module.exports = { signAccessToken };

