import express, { Response } from 'express';
import Session from '../models/Session';
import { protect, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, async (req: AuthRequest, res: Response) => {
    try {
        const { content, keystrokes, analysisScore, aiSuspected } = req.body;

        // Basic validation
        if (!content) {
            res.status(400).json({ message: 'Content is required' });
            return;
        }

        const isAuthentic = aiSuspected !== undefined ? !aiSuspected : true;

        const session = await Session.create({
            user: req.user._id,
            content,
            keystrokes: keystrokes || [],
            analysisScore,
            isAuthentic,
            aiSuspected
        });

        res.status(201).json(session);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', protect, async (req: AuthRequest, res: Response) => {
    try {
        const sessions = await Session.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', protect, async (req: AuthRequest, res: Response) => {
    try {
        const session = await Session.findOne({ _id: req.params.id as any, user: req.user._id });
        if (!session) {
            res.status(404).json({ message: 'Session not found' });
            return;
        }
        res.json(session);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', protect, async (req: AuthRequest, res: Response) => {
    try {
        const { content, keystrokes, analysisScore, aiSuspected } = req.body;
        const session = await Session.findOne({ _id: req.params.id as any, user: req.user._id });

        if (!session) {
            res.status(404).json({ message: 'Session not found' });
            return;
        }

        const isAuthentic = aiSuspected !== undefined ? !aiSuspected : true;

        if (content !== undefined) session.content = content;
        if (keystrokes !== undefined) session.keystrokes = keystrokes;
        if (analysisScore !== undefined) session.analysisScore = analysisScore;
        session.isAuthentic = isAuthentic;
        if (aiSuspected !== undefined) session.aiSuspected = aiSuspected;

        const updatedSession = await session.save();
        res.json(updatedSession);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
    try {
        const session = await Session.findOneAndDelete({ _id: req.params.id as any, user: req.user._id });

        if (!session) {
            res.status(404).json({ message: 'Session not found' });
            return;
        }

        res.json({ message: 'Session deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
