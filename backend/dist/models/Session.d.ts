import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ISession, {}, {}, {}, mongoose.Document<unknown, {}, ISession, {}, mongoose.DefaultSchemaOptions> & ISession & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISession>;
export default _default;
//# sourceMappingURL=Session.d.ts.map