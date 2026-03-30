"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Name, email, and password are required' });
            return;
        }
        const normalizedEmail = email.toLowerCase().trim();
        const userExists = await User_1.default.findOne({ email: normalizedEmail });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = new User_1.default({ name: name.trim(), email: normalizedEmail, passwordHash: password });
        await user.save();
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User_1.default.findOne({ email: normalizedEmail });
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id.toString()),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map