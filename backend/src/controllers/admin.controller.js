const { HttpError } = require('../utils/httpError');
const { User } = require('../models/User');

const adminController = {
  async listUsers(req, res) {
    const users = await User.find().select('email name bio avatarUrl role createdAt').sort({ createdAt: -1 }).lean();
    res.json({ items: users });
  },

  async setUserRole(req, res) {
    const { role } = req.body || {};
    if (!role || !['user', 'admin'].includes(role)) throw new HttpError(400, 'role must be user or admin');
    const user = await User.findById(req.params.id);
    if (!user) throw new HttpError(404, 'User not found');
    user.role = role;
    await user.save();
    const safe = await User.findById(user._id).select('email name bio avatarUrl role createdAt');
    res.json({ user: safe });
  }
};

module.exports = { adminController };

