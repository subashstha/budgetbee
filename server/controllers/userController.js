const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// @route PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, currency, theme, notifications } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (currency) updateData.currency = currency;
    if (theme) updateData.theme = theme;
    if (notifications) updateData.notifications = notifications;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true, runValidators: true,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        theme: user.theme,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/users/password
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/users/avatar
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload buffer to Cloudinary, overwrite by user ID so old image is replaced
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'budgetbee/avatars', public_id: req.user._id.toString(), overwrite: true, resource_type: 'image' },
        (err, data) => (err ? reject(err) : resolve(data))
      ).end(req.file.buffer);
    });

    await User.findByIdAndUpdate(req.user._id, { avatar: result.secure_url });

    res.json({ success: true, avatar: result.secure_url });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/users/account
const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile, updatePassword, uploadAvatar, deleteAccount };
