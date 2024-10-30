// controllers/auth.controller.ts
import Customer from '../models/customer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: any, res: any) => {
    const { user_name, password, full_name, email, phone_number, address, user_avatar, google_id } = req.body;

    try {
        // Check if user already exists
        const existingUser = await Customer.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Create and save new user
        const newUser = new Customer({
            user_name,
            password, // Will be hashed in the model's pre-save hook
            full_name,
            email,
            phone_number,
            address,
            user_avatar,
            google_id,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req: any, res: any) => {

    try {
        const { user_name, password } = req.body;

        // Find user by username
        const user = await Customer.findOne({ user_name });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY!, { expiresIn: '1h' });

        // Store user data in session
        req.session.user = user; // Store the whole user object or specific properties as needed
        console.log(req.session.user)
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
