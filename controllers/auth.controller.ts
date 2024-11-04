import Customer from "../models/customer";
import Staff from "../models/staff";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");



// Decoded token
export const user = async (req: any, res: any) => {
  const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Giải mã token để lấy userId và role
    const decoded: any = jwt.verify(token, process.env.JWT_KEY!);
    const { userId, role } = decoded;

    let user; // Biến để lưu thông tin người dùng

    // Kiểm tra vai trò và lấy thông tin người dùng từ cơ sở dữ liệu
    if (role === 'customer') {
      user = await Customer.findById(userId).select('-password'); // Không lấy mật khẩu
      if (!user) {
        return res.status(404).json({ message: 'Customer not found' });
      }
    } else if (role === 'staff') {
      user = await Staff.findById(userId).select('-password'); // Không lấy mật khẩu
      if (!user) {
        return res.status(404).json({ message: 'Staff not found' });
      }
    } else {
      return res.status(403).json({ message: 'Invalid role' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to authenticate token', error });
  }
};

// Register a new customer
export const register = async (req: any, res: any) => {
  const {
    user_name,
    password,
    full_name,
    email,
    phone_number,
    address,
    user_avatar,
    google_id,
  } = req.body;

  try {
    if (!user_name || !email) {
      return res
        .status(400)
        .json({ message: "user_name and email are required." });
    }

    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
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
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login by google
export const loginByGoogle = async (req: any, res: any) => {
  try {
    const { user_name, email, full_name, password } = req.body;

    const user = await Customer.findOne({ email: email });

    if (!user) {
      try {
        const newCustomer = new Customer({
          user_name,
          email,
          full_name,
          password: password
        });
        const savedCustomer = await newCustomer.save();
        console.log(savedCustomer);
        // Generate token
        const token = jwt.sign(
          { userId: savedCustomer._id, role: "customer" },
          process.env.JWT_KEY!,
          { expiresIn: "1h" }
        );

        req.session.user = savedCustomer;
        return res
          .status(200)
          .json({ message: "Login successful", token, role: "customer" });
      } catch (error) {
        res.status(500).json({ message: "Server error", error });
      }
    } else {
      const token = jwt.sign(
        { userId: user._id, role: "customer" },
        process.env.JWT_KEY!,
        { expiresIn: "1h" }
      );

      req.session.user = user;
      return res
        .status(200)
        .json({ message: "Login successful", token, role: "customer" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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
          return res.status(404).json({ message: "Staff not found" });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(
          password,
          staff.password
        );
        if (!isPasswordCorrect) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        if (staff.is_staff) {

          // Generate token
          const token = jwt.sign(
            { userId: staff._id, role: "staff" },
            process.env.JWT_KEY!,
            { expiresIn: "1h" }
          );

          req.session.user = staff; // Store staff information in session

          return res
            .status(200)
            .json({ message: "Login successful", token, role: "staff" });
        }
        else {
          // Generate token
          const token = jwt.sign(
            { userId: staff._id, role: "manager" },
            process.env.JWT_KEY!,
            { expiresIn: "1h" }
          );

          return res
            .status(200)
            .json({ message: "Login successful", token, role: "manager" });
        }
      } catch (error) {
        res.status(500).json({ message: "Server error", error });
      }
    }

    const isPasswordCorrect = await bcrypt.compare(password, user?.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user?._id, role: "customer" },
      process.env.JWT_KEY!,
      { expiresIn: "1h" }
    );

    req.session.user = user;
    console.log({ token, role: "customer" });

    res.status(200).json({ token, role: "customer" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
