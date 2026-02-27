import express from 'express';
import Booking from '../models/Booking.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.get('/available', async (req, res) => {
    try {
        if (req.user.userType !== 'worker') {
            return res.status(403).json({ message: 'Workers only' });
        }
        const bookings = await Booking.find({ status: 'Pending', workerId: null })
            .populate('userId', 'name phone')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Get available jobs error:', error.message);
        res.status(500).json({ message: 'Server error fetching available jobs' });
    }
});

router.get('/', async (req, res) => {
    try {
        const query =
            req.user.userType === 'worker'
                ? { workerId: req.user._id }
                : { userId: req.user._id };

        const bookings = await Booking.find(query).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error.message);
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
});

router.post('/', async (req, res) => {
    try {
        if (req.user.userType === 'worker') {
            return res.status(403).json({ message: 'Workers cannot create bookings' });
        }

        const { serviceId, serviceName, date, time, address, notes, price } = req.body;

        if (!serviceId || !serviceName || !date || !time || !address || !price) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const booking = await Booking.create({
            userId: req.user._id,
            serviceId,
            serviceName,
            date,
            time,
            address,
            notes: notes || '',
            price,
            status: 'Pending',
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error('Create booking error:', error.message);
        res.status(500).json({ message: 'Server error creating booking' });
    }
});

router.patch('/:id/accept', async (req, res) => {
    try {
        if (req.user.userType !== 'worker') {
            return res.status(403).json({ message: 'Workers only' });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.status !== 'Pending' || booking.workerId) {
            return res.status(400).json({ message: 'Job is no longer available' });
        }

        booking.workerId = req.user._id;
        booking.workerName = req.user.name;
        booking.status = 'Confirmed';
        await booking.save();

        res.json(booking);
    } catch (error) {
        console.error('Accept job error:', error.message);
        res.status(500).json({ message: 'Server error accepting job' });
    }
});

router.patch('/:id/complete', async (req, res) => {
    try {
        if (req.user.userType !== 'worker') {
            return res.status(403).json({ message: 'Workers only' });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (!booking.workerId || booking.workerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to complete this job' });
        }
        if (booking.status !== 'Confirmed') {
            return res.status(400).json({ message: 'Only confirmed jobs can be marked complete' });
        }

        booking.status = 'Completed';
        await booking.save();

        res.json(booking);
    } catch (error) {
        console.error('Complete job error:', error.message);
        res.status(500).json({ message: 'Server error completing job' });
    }
});
router.patch('/:id/cancel', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        
        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        if (booking.status !== 'Pending') {
            return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
        }

        booking.status = 'Cancelled';
        await booking.save();

        res.json(booking);
    } catch (error) {
        console.error('Cancel booking error:', error.message);
        res.status(500).json({ message: 'Server error cancelling booking' });
    }
});

export default router;
