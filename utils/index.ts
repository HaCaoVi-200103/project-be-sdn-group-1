import Cake from "../models/cake";
import Customer from "../models/customer";
import Staff from "../models/staff";
import Rating from "../models/rating";

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