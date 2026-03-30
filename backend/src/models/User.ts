import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    name: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
}, { timestamps: true });

UserSchema.pre('save', async function(this: any) {
    if (!this.isModified('passwordHash')) return;
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    if (!candidatePassword || !this.passwordHash) {
        return false;
    }

    try {
        return await bcrypt.compare(candidatePassword, this.passwordHash);
    } catch (error) {
        return false;
    }
};

export default mongoose.model<IUser>('User', UserSchema);
