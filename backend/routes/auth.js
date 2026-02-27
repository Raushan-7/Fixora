import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone, userType } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = await User.create({ name, email, password, phone, userType });

        res.status(201).json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                userType: user.userType,
            },
        });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                userType: user.userType,
            },
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
});

router.get('/me', verifyToken, (req, res) => {
    const { _id, name, email, phone, userType } = req.user;
    res.json({
        id: _id,
        name,
        email,
        phone,
        userType,
    });
});

export default router;
