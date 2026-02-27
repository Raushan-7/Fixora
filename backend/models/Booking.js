import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        workerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        workerName: {
            type: String,
            default: '',
        },
        serviceId: {
            type: String,
            required: [true, 'Service ID is required'],
        },
        serviceName: {
            type: String,
            required: [true, 'Service name is required'],
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
        },
        time: {
            type: String,
            required: [true, 'Time slot is required'],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        notes: {
            type: String,
            default: '',
        },
        price: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
