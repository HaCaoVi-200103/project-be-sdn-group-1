import { Request, Response } from "express";
import Staff from "../models/staff";
import { checkStaffByEmail, checkStaffById, verifyEmail, verifyPhoneNumber } from "../utils";
import { uploadFile } from "./uploadFile";
import Order from "../models/order";

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

        const checkEmailFormat = verifyEmail(email)

        if (!checkEmailFormat) {
            return res.status(400).send("Email is not in correct format. Must be example@gmail.com!!!")
        }

        const checkPhoneFormat = verifyPhoneNumber(phone_number)

        if (!checkPhoneFormat) {
            return res.status(400).send("Phone number is not in correct format!!!")
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
        const { staffId } = req.params;

        if (!staffId) {
            return res.status(400).send("Missing required params!!!")
        }

        const { staff_name, password, phone_number, full_name, address, } = req.body;

        if (!staff_name || !password || !phone_number || !full_name || !address) {
            return res.status(400).send("Missing required field!!!")
        }

        const checkPhoneFormat = verifyPhoneNumber(phone_number)

        if (!checkPhoneFormat) {
            return res.status(400).send("Phone number is not in correct format!!!")
        }

        console.log(req.file);

        if (!req.file) {
            await Staff.findByIdAndUpdate(staffId,
                {
                    staff_name: staff_name,
                    password: password,
                    phone_number: phone_number,
                    address: address,
                    full_name: full_name,
                });

            return res.status(201).json("Update Success")
        }

        const uploadResponse = await uploadFile(req, res, async () => { }, "staffImages")

        if (!uploadResponse && uploadResponse.status !== 200) {
            res.status(500).send("Error uploading file.");
        }
        const { downloadURL } = uploadResponse.data;

        await Staff.findByIdAndUpdate(staffId,
            {
                staff_name: staff_name,
                password: password,
                phone_number: phone_number,
                address: address,
                full_name: full_name,
                staff_avatar: downloadURL
            });

        return res.status(201).json("Update Success")

    } catch (error) {
        console.log("Create Staff Error: ", error);
        return res.status(500).json("Internal Server Error")
    }
}

export const getMonthlyOrderStaff = async (req: Request, res: Response) => {
    try {
        const month = parseInt(req.body.month as string) || new Date().getMonth();
        const year = parseInt(req.body.year as string) || new Date().getFullYear();
        const orders = await Order.find({
            status: { $ne: "Pending" },
            order_date: {
                $gte: new Date(year, month, 1),
                $lt: new Date(year, month + 1, 1),
            },
        });
        const data = []
        const arrayStaff = [];
        const listTotalPrice = calculateTotalPriceByStaff(orders)

        for (const element of orders) {
            const staff = await checkStaffById(element.staff_id + "");
            const count = orders.filter(x => x.staff_id + "" === element.staff_id + "")
            const checkStaff = arrayStaff.filter(x => x + "" === element.staff_id + "")
            if (checkStaff.length === 0) {
                console.log(listTotalPrice[element.staff_id + ""].toFixed(2));

                const item = {
                    staff_name: staff?.staff_name,
                    total: listTotalPrice[element.staff_id + ""],
                    total_accept: count.length
                }

                data.push(item)
            }

            arrayStaff.push(element.staff_id);
        }

        return res.json(data)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get monthly sales data" });
    }
};

function calculateTotalPriceByStaff(orders: any[]) {
    return orders.reduce((acc, order) => {
        const staffId = order.staff_id;
        const totalPrice = order.total_price;

        if (!acc[staffId]) {
            acc[staffId] = 0;
        }

        acc[staffId] += totalPrice;

        return acc;
    }, {});
}