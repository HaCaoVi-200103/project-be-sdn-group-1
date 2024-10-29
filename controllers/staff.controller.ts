import { Request, Response } from "express";
import Staff from "../models/staff";

export const getAllStaff = async (req: Request, res: Response) => {
    try {
        const result = await Staff.find({ is_staff: true });
        return res.status(200).json(result);
    } catch (error) {
        console.log("Get Staff Error: ", error);
        return res.status(500).json("Internal Server Error")
    }
}