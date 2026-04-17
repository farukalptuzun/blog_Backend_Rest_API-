const { validate } = require('../utils/validate');
const { registerSchema, loginSchema } = require('../validators/auth.validators');
const authService = require('../services/auth.service');
const { signAccessToken } = require('../utils/jwt');
const { User } = require('../models/User');

const authController = {
  async register(req, res) {
    const dto = validate(registerSchema, req.body);
    const user = await authService.register(dto);
    const token = signAccessToken(user._id);
    const safeUser = await User.findById(user._id).select('-passwordHash');
    res.status(201).json({ user: safeUser, accessToken: token });
  },

  async login(req, res) {
    const dto = validate(loginSchema, req.body);
    const user = await authService.login(dto);
    const token = signAccessToken(user._id);
    const safeUser = await User.findById(user._id).select('-passwordHash');
    res.json({ user: safeUser, accessToken: token });
  },

  async me(req, res) {
    res.json({ user: req.user });
  }
};

module.exports = { authController };

