import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to DB!');
}).catch((err) => {
    console.error(err);
});

const app = express();
app.use(express.json());

// Routers
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Error-handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Default to 500 if not specified
    const message = err.message || "Internal Server Error"; // Default message
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on Port 3000!!');
});
