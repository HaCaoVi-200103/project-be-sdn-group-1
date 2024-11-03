import Customer from '../models/customer';
import Staff from '../models/staff';
import jwt from 'jsonwebtoken';
const bcrypt = require('bcrypt');

// Register a new customer
export const register = async (req: any, res: any) => {
    const { user_name, password, full_name, email, phone_number, address, user_avatar, google_id } = req.body;

    try {
        if (!user_name || !email) {
            return res.status(400).json({ message: 'user_name and email are required.' });
        }

        const existingUser = await Customer.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        const newUser = new Customer({
            user_name,
            password, // Will be hashed in pre-save hook
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

// Login customer
export const login = async (req: any, res: any) => {
    try {
        const { user_name, email, password } = req.body;

        const user = await Customer.findOne({
            $or: [{ user_name }, { email }],
        });

        if (!user) {
            try {
                const staff = await Staff.findOne({
                    $or: [{ user_name }, { email }, { staff_name: user_name }],
                });

                if (!staff) {
                    return res.status(404).json({ message: 'Staff not found' });
                }

                // Verify password
                const isPasswordCorrect = await bcrypt.compare(password, staff.password);
                if (!isPasswordCorrect) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                // Generate token
                const token = jwt.sign({ userId: staff._id, role: 'staff' }, process.env.JWT_KEY!, { expiresIn: '1h' });

                req.session.user = staff; // Store staff information in session
                if (staff.is_staff)
                    return res.status(200).json({ message: 'Login successful', token, role: 'staff' });
                else return res.status(200).json({ message: 'Login successful', token, role: 'manager' });


            } catch (error) {
                res.status(500).json({ message: 'Server error', error });
            }
        }

        const isPasswordCorrect = await bcrypt.compare(password, user?.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user?._id, role: 'customer' }, process.env.JWT_KEY!, { expiresIn: '1h' });

        req.session.user = user;
        console.log({ token, role: 'customer' });


        res.status(200).json({ token, role: 'customer' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Register a new staff
export const registerStaff = async (req: any, res: any) => {
    const { staff_name, password, full_name, email, phone_number, address, staff_avatar } = req.body;

    try {
        if (!staff_name || !email) {
            return res.status(400).json({ message: 'staff_name and email are required.' });
        }

        // Check if staff already exists
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ message: 'Email or staff_name is already in use' });
        }

        // Create a new staff member
        const newStaff = new Staff({
            staff_name,
            password,
            full_name,
            email,
            phone_number,
            address,
            staff_avatar,

        });

        await newStaff.save();
        res.status(201).json({ message: 'Staff registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login staff
export const loginStaff = async (req: any, res: any) => {
    try {
        const { staff_name, email, password } = req.body;

        const staff = await Staff.findOne({
            $or: [{ staff_name }, { email }],
        });

        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, staff.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: staff._id, role: 'staff' }, process.env.JWT_KEY!, { expiresIn: '1h' });

        req.session.user = staff; // Store staff information in session
        res.status(200).json({ message: 'Login successful', token, role: 'staff' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};