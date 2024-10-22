import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists by username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists.' });
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
        console.error(error);

        if (error.code === 11000) {
            // Handle duplicate key error
            res.status(400).json({ message: 'Duplicate key error: Username or email already exists.' });
        } else {
            // Handle other errors
            res.status(500).json({ message: 'Something went wrong on the server.' });
        }
    }
};
