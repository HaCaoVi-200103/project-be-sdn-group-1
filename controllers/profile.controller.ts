import { Request, Response } from "express";
import Customer from "../models/customer";
import { uploadFile } from "./uploadFile";
import { checkCustomerByEmail, checkSaffByEmail, checkStaffByEmail, checkStaffById, checkUserById, generateRandomCode, sendEmail, updatePasswordStaff, verifyEmail, verifyPhoneNumber } from "../utils";
import { compare, genSalt, hash } from "bcrypt";
import Staff from "../models/staff";

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

export const updateProfileCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send("Missing required params!!!")
        }

        const { phone_number, full_name, address, } = req.body;

        if (!phone_number || !full_name || !address) {
            return res.status(400).send("Missing required field!!!")
        }

        const checkPhoneFormat = verifyPhoneNumber(phone_number)

        if (!checkPhoneFormat) {
            return res.status(400).send("Phone number is not in correct format!!!")
        }

        if (!req.file) {

            await Customer.findByIdAndUpdate(id,
                {
                    phone_number: phone_number,
                    address: address,
                    full_name: full_name,
                });

            return res.status(201).json("Update Success")
        }

        const uploadResponse = await uploadFile(req, res, async () => { }, "customerImages")

        if (!uploadResponse && uploadResponse.status !== 200) {
            res.status(500).send("Error uploading file.");
        }
        const { downloadURL } = uploadResponse.data;

        await Customer.findByIdAndUpdate(id,
            {
                phone_number: phone_number,
                address: address,
                full_name: full_name,
                user_avatar: downloadURL
            });

        return res.status(201).json("Update Success")

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error")
    }
}

export const postSendEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).send("Missing required field!!!")
        }

        const to = email;
        const subject = 'SweetBites: Email Verification';
        const code = generateRandomCode();
        sendEmail(to, subject, code);

        return res.status(200).send({ code: code });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error")
    }
}

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { id, password, staff_id } = req.body;
        if (!id || !password) {
            return res.status(400).send("Missing required field!!!")
        }

        const salt = await genSalt();

        const hashPass = await hash(password, salt)
        if (id) {
            const user = await checkUserById(id)
            if (!user) {
                return res.status(404).send("User not found")
            }

            await Customer.findByIdAndUpdate(id, { password: hashPass })
        }
        else if (staff_id) {
            const staff = await checkStaffById(staff_id)
            if (!staff) {
                return res.status(404).send("Staff not found")
            }
            await Staff.findByIdAndUpdate(staff_id, { password: hashPass })

        }
        return res.status(201).json({ message: "Update Successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error")
    }
}

export const verifyPassword = async (req: Request, res: Response) => {
    try {
        const { userId, password } = req.body;
        if (!userId || !password) {
            return res.status(400).send("Missing required field!!!")
        }

        const check = await checkUserById(userId);

        if (!check) {
            return res.status(404).send("User not found")
        }

        const comparePass = await compare(password, check.password)
        console.log(comparePass);

        if (!comparePass) {
            return res.status(200).json(false)
        }

        return res.status(200).json(true)
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error")
    }
}


export const updateProfileStaff = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send("Missing required params!!!")
        }

        const { phone_number, full_name, address, } = req.body;

        if (!phone_number || !full_name || !address) {
            return res.status(400).send("Missing required field!!!")
        }

        const checkPhoneFormat = verifyPhoneNumber(phone_number)

        if (!checkPhoneFormat) {
            return res.status(400).send("Phone number is not in correct format!!!")
        }

        if (!req.file) {

            await Staff.findByIdAndUpdate(id,
                {
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

        await Staff.findByIdAndUpdate(id,
            {
                phone_number: phone_number,
                address: address,
                full_name: full_name,
                staff_avatar: downloadURL
            });

        return res.status(201).json("Update Success")

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error")
    }
}


export const fogotPassword = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Missing required field!!!")
        }

        const salt = await genSalt();

        const hashPass = await hash(password, salt)

        const customer = await checkCustomerByEmail(email);

        if (!customer) {
            const staff = await checkSaffByEmail(email)
            if (!staff) {
                const result = await updatePasswordStaff(email, hashPass)

                if (!result) {
                    throw new Error("UPDATE PASSWORD STAFF IS FAIL")
                }
                return res.status(200).json({ message: "UPDATE PASSWORD SUSSESSFULL" })
            }
        }

        await Customer.findOneAndUpdate({ email: email }, { password: hashPass })


        return res.status(201).json({ message: "Update Successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error")
    }
}


export const checkEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send("Miissing required field!!!")
        }

        const checkEmailFormat = verifyEmail(email);

        if (!checkEmailFormat) {
            return res.status(200).json({ message: "Email is not in correct format. Must be example@gmail.com!!!", statusCode: 400 })
        }

        const customer = await checkCustomerByEmail(email);
        if (!customer) {
            const staff = await checkStaffByEmail(email);
            if (!staff) {
                return res.status(200).json({ message: "Not found email in system", statusCode: 404 })
            }
            return res.status(200).json({ message: "Email already exist", statusCode: 200 })

        }

        return res.status(200).json({ message: "Email already exist", statusCode: 200 })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error")
    }
}