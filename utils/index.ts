import Cake from "../models/cake";
import Customer from "../models/customer";
import Order from "../models/order";
import Rating from "../models/rating";
import Staff from "../models/staff";
import nodemailer from "nodemailer"
import "dotenv/config"

export const checkOrderById = async (id: string) => {
    try {
        const order = await Order.findById(id);
        if (!order) {
            return null
        }
        return order;
    } catch (error) {
        console.log("aaa")
    }
}

export const checkCakeById = async (id: string) => {
    try {
        const cake = await Cake.findById(id);
        if (!cake) {
            return null
        }
        return cake;
    } catch (error) {
        return null
    }
}

export const checkUserById = async (id: string) => {
    try {
        const user = await Customer.findById(id);
        if (!user) {
            return null
        }
        return user;
    } catch (error) {
        return null
    }
}

export const checkStaffById = async (id: string) => {
    try {
        const user = await Staff.findById(id);
        if (!user) {
            return null
        }
        return user;
    } catch (error) {
        return null
    }
}

export const checkStaffByEmail = async (email: string) => {
    try {
        const staff = await Staff.findOne({ email: email });
        if (!staff) {
            return null
        }
        return staff;
    } catch (error) {
        return null
    }
}

export const checkRatingCake = async (cakeId: string, userId: string, ratingId: string) => {
    try {
        const rating = await Rating.findOne({ cake_id: cakeId, user_id: userId, _id: ratingId });
        if (!rating) {
            return null
        }
        return rating;
    } catch (error) {
        return null
    }
}

export const checkRatingById = async (id: string) => {
    try {
        const rating = await Rating.findById(id);
        if (!rating) {
            return null
        }
        return rating;
    } catch (error) {
        return null
    }
}

export const checkUserDeleteRating = async (userId: string, ratingId: string) => {
    try {
        const rating = await Rating.findOne({ _id: ratingId, user_id: userId });
        if (!rating) {
            return null;
        }
        return rating;
    } catch (error) {
        return null
    }
}

export const verifyEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9]+@gmail\.com$/;
    return regex.test(email);
};

export const verifyPhoneNumber = (phone: string) => {
    const regex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;
    return regex.test(phone);
};

export const verifyRatingValue = (rating: string | number) => {
    const ratingNumber = Number(rating);
    return !isNaN(ratingNumber) && ratingNumber >= 0 && ratingNumber <= 5;
};

export const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendEmail = (to: string, subject: string, code: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vihcce170371@fpt.edu.vn',
            pass: process.env.KEY_GG
        }
    });

    const mailOptions = {
        from: 'vihcce170371@fpt.edu.vn',
        to: to,
        subject: subject,
        text: code
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Send Email ERROR: ", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export const checkCustomerByEmail = async (email: string) => {
    try {
        const res = await Customer.findOne({ email: email });
        if (!res) {
            return false;
        }

        return res
    } catch (error) {
        return false;
    }
}

export const checkSaffByEmail = async (email: string) => {
    try {
        const res = await Customer.findOne({ email: email });
        if (!res) {
            return false;
        }
        return res;
    } catch (error) {
        return false;
    }
}

export const updatePasswordStaff = async (email: string, password: string) => {
    try {
        const result = await Staff.findOneAndUpdate({ email: email }, { password: password })
        if (!result) {
            return false;
        }

        return true
    } catch (error) {
        return false;
    }
}
