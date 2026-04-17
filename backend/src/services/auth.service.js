const bcrypt = require('bcryptjs');

const { User } = require('../models/User');
const { HttpError } = require('../utils/httpError');

async function register({ email, password, name }) {
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) throw new HttpError(409, 'Email already in use');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: email.toLowerCase().trim(),
    passwordHash,
    name
  });

  return user;
}

async function login({ email, username, password }) {
  let user;
  if (username != null && String(username).trim() !== '') {
    user = await User.findOne({ username: String(username).toLowerCase().trim() }).select('+passwordHash');
  } else if (email) {
    user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  } else {
    throw new HttpError(400, 'email or username is required');
  }
  if (!user) throw new HttpError(401, 'Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, 'Invalid credentials');

  return user;
}

module.exports = { register, login };

