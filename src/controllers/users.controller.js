const path = require('path');

const { validate } = require('../utils/validate');
const { updateMeSchema } = require('../validators/user.validators');
const { User } = require('../models/User');
const { HttpError } = require('../utils/httpError');

const usersController = {
  async updateMe(req, res) {
    const dto = validate(updateMeSchema, req.body);
    const user = await User.findById(req.user._id);
    if (!user) throw new HttpError(404, 'User not found');

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.bio !== undefined) user.bio = dto.bio;

    await user.save();
    const safe = await User.findById(user._id).select('-passwordHash');
    res.json({ user: safe });
  },

  async uploadAvatar(req, res) {
    if (!req.file) throw new HttpError(400, 'File is required');

    const user = await User.findById(req.user._id);
    if (!user) throw new HttpError(404, 'User not found');

    const avatarUrl = path.posix.join('/uploads', req.file.filename);
    user.avatarUrl = avatarUrl;
    await user.save();

    const safe = await User.findById(user._id).select('-passwordHash');
    res.json({ user: safe });
  }
};

module.exports = { usersController };

