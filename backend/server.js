import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import contactRoutes from './routes/contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? true   // allow same origin in production
        : "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);






if (process.env.NODE_ENV === "production") {
    const clientPath = path.join(__dirname, "../frontend/dist");

    app.use(express.static(clientPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(clientPath, "index.html"));
    });
}
else {
    app.get('/', (req, res) => {
    res.json({ message: 'Fixora API is running ✅' });
});
}




app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});



mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });