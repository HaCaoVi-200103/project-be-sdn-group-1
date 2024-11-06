import { Request, Response } from "express";
import Order from "../models/order";



export const createOrderCashPayment = async (req: Request, res: Response) => {
  try {
    const { total, was_paid, description, cusId } = req.body;

    if (!total || !description || !cusId) {
      return res.status(200).json({ message: "Missing required field!!!", statusCode: 400 })
    }

    await Order.create({ total_price: total, cus_id: cusId, order_description: description, was_paid: was_paid ? was_paid : false })
    return res.status(200).json({ message: "Order Successfull", statusCode: 200 })
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
}


export const createOrderQRPayment = async (req: Request, res: Response) => {
  try {
    const { total, was_paid, description, cusId } = req.body;
    if (!total || was_paid === null || !description || !cusId) {
      return res.status(200).json({ message: "Missing required field!!!", statusCode: 400 })
    }
    const order = await Order.create({ total_price: total, cus_id: cusId, order_description: description, was_paid: was_paid ? was_paid : false })

    const QR = `https://img.vietqr.io/image/sacombank-0907626222-compact2.png?amount=${total}&addInfo=${order._id}&accountName=HA CAO VI`
    return res.status(200).json({ QR: QR })
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
} 
