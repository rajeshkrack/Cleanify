import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists by username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            const error = new Error('Username or email already exists.');
            error.statusCode = 400; // Bad request
            throw error; // Trigger the error middleware
        }

        // Hash the password before saving the user
        const hashedPassword = bcrypt.hashSync(password, 10); // 10 is the salt rounds

        // Create a new user with the hashed password
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        // Send success response
        res.status(201).json({ message: 'User created successfully!' });

    } catch (error) {
        // Pass the error to the middleware for centralized error handling
        next(error);
    }
};
