"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Session_1 = __importDefault(require("../models/Session"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.protect, async (req, res) => {
    try {
        const { content, keystrokes, analysisScore, aiSuspected } = req.body;
        // Basic validation
        if (!content) {
            res.status(400).json({ message: 'Content is required' });
            return;
        }
        const isAuthentic = aiSuspected !== undefined ? !aiSuspected : true;
        const session = await Session_1.default.create({
            user: req.user._id,
            content,
            keystrokes: keystrokes || [],
            analysisScore,
            isAuthentic,
            aiSuspected
        });
        res.status(201).json(session);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const sessions = await Session_1.default.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/:id', auth_1.protect, async (req, res) => {
    try {
        const session = await Session_1.default.findOne({ _id: req.params.id, user: req.user._id });
        if (!session) {
            res.status(404).json({ message: 'Session not found' });
            return;
        }
        res.json(session);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put('/:id', auth_1.protect, async (req, res) => {
    try {
        const { content, keystrokes, analysisScore, aiSuspected } = req.body;
        const session = await Session_1.default.findOne({ _id: req.params.id, user: req.user._id });
        if (!session) {
            res.status(404).json({ message: 'Session not found' });
            return;
        }
        const isAuthentic = aiSuspected !== undefined ? !aiSuspected : true;
        if (content !== undefined)
            session.content = content;
        if (keystrokes !== undefined)
            session.keystrokes = keystrokes;
        if (analysisScore !== undefined)
            session.analysisScore = analysisScore;
        session.isAuthentic = isAuthentic;
        if (aiSuspected !== undefined)
            session.aiSuspected = aiSuspected;
        const updatedSession = await session.save();
        res.json(updatedSession);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const session = await Session_1.default.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!session) {
            res.status(404).json({ message: 'Session not found' });
            return;
        }
        res.json({ message: 'Session deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=session.js.map