import mongoose, { Schema, Document } from 'mongoose';

export interface IKeystroke {
    key: string;
    timestamp: number;
    type: 'keydown' | 'keyup' | 'paste';
    pastedText?: string;
}

export interface ISession extends Document {
    user: mongoose.Types.ObjectId;
    content: string;
    keystrokes: IKeystroke[];
    analysisScore?: number;
    isAuthentic?: boolean;
    aiSuspected?: boolean;
}

const KeystrokeSchema = new Schema({
    key: { type: String, required: true },
    timestamp: { type: Number, required: true },
    type: { type: String, enum: ['keydown', 'keyup', 'paste'], required: true },
    pastedText: { type: String }
}, { _id: false });

const SessionSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    keystrokes: [KeystrokeSchema],
    analysisScore: { type: Number },
    isAuthentic: { type: Boolean },
    aiSuspected: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<ISession>('Session', SessionSchema);
