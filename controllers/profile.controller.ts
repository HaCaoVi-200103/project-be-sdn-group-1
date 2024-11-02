import { Request, Response } from "express";
import Customer from "../models/customer";

export const getProfileById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send("Missing required params");
        }
        const result = await Customer.findById(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).send("User not found");
    }
}