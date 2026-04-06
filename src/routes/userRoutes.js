const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.post('/register', [
  body('username').isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').isEmail().withMessage('Invalid email format')
], UserController.register);

router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], UserController.login);

router.get('/me', auth, UserController.getUserInfo);
router.get('/leaderboard', UserController.getLeaderboard);

// Admin routes
router.post('/admin/register', [
  body('username').isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').isEmail().withMessage('Invalid email format')
], admin, UserController.createAdmin);

router.put('/admin/role', admin, UserController.updateUserRole);
router.get('/admin/users', admin, UserController.getAllUsers);
router.delete('/:userId', admin, UserController.deleteUser);

module.exports = router;