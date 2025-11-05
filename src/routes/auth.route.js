import { Router } from 'express';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const router = Router();

// Helper function to generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new admin user
 * @access  Public (FOR DEVELOPMENT ONLY)
 * @warning After you create your first admin, DELETE or PROTECT this route!
 */
router.post('/register', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // --- THIS IS A SAFETY CHECK ---
        // --- It prevents anyone else from creating an admin account ---
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            return res.status(403).json({ message: 'Admin user already exists. Registration is locked.' });
        }
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.create({ email, password });

        res.status(201).json({
            message: 'Admin user created. You can now log in.',
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate an admin user & get token
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
});

export default router;
