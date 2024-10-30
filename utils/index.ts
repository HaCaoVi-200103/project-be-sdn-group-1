import { Request, Response } from "express";
import Cake from "../models/cake";
import Customer from "../models/customer";
import Order from "../models/order";

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