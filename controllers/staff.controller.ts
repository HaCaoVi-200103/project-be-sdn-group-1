import { Request, Response } from "express";
import Staff from "../models/staff";
import { checkStaffByEmail, checkStaffById } from "../utils";
import { uploadFile } from "./uploadFile";

export const getAllStaff = async (req: Request, res: Response) => {
    try {
        const result = await Staff.find({ is_staff: true });
        return res.status(200).json(result);
    } catch (error) {
        console.log("Get Staff Error: ", error);
        return res.status(500).json("Internal Server Error")
    }
}

export const getStaffById = async (req: Request, res: Response) => {
    try {
        const { staffId } = req.params;

        if (!staffId) {
            return res.status(400).send("Missing required params!!!")
        }
        const check = await checkStaffById(staffId)
        if (!check) {
            return res.status(404).send("Staff ID not found")
        }
        return res.status(200).json(check)
    } catch (error) {
        console.log("Get Staff ID Error: ", error);
        return res.status(500).json("Internal Server Error")
    }
}

export const createStaff = async (req: Request, res: Response) => {
    try {
        const { staff_name, password, phone_number, email, full_name, address } = req.body;

        if (!staff_name || !password || !phone_number || !email || !full_name || !address) {
            return res.status(400).send("Missing required field!!!")
        }

        const check = await checkStaffByEmail(email);
        if (check) {
            return res.status(409).send("Email is exist!!!")
        }
        await Staff.create({ staff_name: staff_name, password: password, phone_number: phone_number, email: email, address: address, full_name: full_name })
        return res.status(200).json({ message: "Create Success" })
    } catch (error) {
        console.log("Create Staff Error: ", error);
        return res.status(500).json("Internal Server Error")
    }
}

export const updateStaff = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded!!!")
        }

        // const uploadResponse = await uploadFile(req, res, async () => { })

        const { staff_name, password, phone_number, email, full_name, address, } = req.body;

        if (!staff_name || !password || !phone_number || !email || !full_name || !address) {
            return res.status(400).send("Missing required field!!!")
        }

        const check = await checkStaffByEmail(email);
        if (!check) {
            return res.status(409).send("Email not found!!!")
        }

        await Staff.findByIdAndUpdate(check._id,
            {
                staff_name: staff_name,
                password: password,
                phone_number: phone_number,
                email: email,
                address: address,
                full_name: full_name
            });

        return res.status(201).json("Update Success")

    } catch (error) {
        console.log("Create Staff Error: ", error);
        return res.status(500).json("Internal Server Error")
    }
}