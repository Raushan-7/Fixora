import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import contactRoutes from './routes/contact.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
}));
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Fixora2 API is running ✅' });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log(' Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(` Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error(' MongoDB connection failed:', err.message);
        process.exit(1);
    });
