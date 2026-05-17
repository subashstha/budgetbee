const express = require('express');
const router = express.Router();
const { updateProfile, updatePassword, uploadAvatar, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.delete('/account', deleteAccount);

module.exports = router;
