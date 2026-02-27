import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
        },
    },
    { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
