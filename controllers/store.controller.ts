import { Request, Response } from "express";
import Store from "../models/store"; // Adjust the path as necessary

export const getAllStores = async (req: Request, res: Response) => {
    try {
        const stores = await Store.find();
        return res.json(stores);
    } catch (error) {
        console.error("Error retrieving all stores:", error);
        return res.status(500).json({ message: "ERROR" });
    }
};

