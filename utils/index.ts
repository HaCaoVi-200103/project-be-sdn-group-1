import { Request, Response } from "express";
import Cake from "../models/cake";
import Customer from "../models/customer";
import Staff from "../models/staff";

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