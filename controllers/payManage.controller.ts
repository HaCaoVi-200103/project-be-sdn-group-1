import { Request, Response } from "express";
import Order from "../models/order";
import mongoose from "mongoose";


export const createOrderCashPayment = async (req: Request, res: Response) => {
  try {
    const { cus_id, total_price, order_description, staff_id } = req.body;
    if (!cus_id || !total_price) {
      return res.status(400).json("Failed!");
    }

    const newOrder = await Order.create({
      cus_id,
      total_price,
      order_description,
      staff_id,
      status: "Success", 
      was_paid: true,
    });

    return res.status(201).json({ message: "Create order successful!", order: newOrder });
  } catch (error) {
    console.log("Lỗi tạo đơn hàng thanh toán tiền mặt: ", error);
    return res.status(500).json("Lỗi hệ thống");
  }
};


export const createOrderQRPayment = async (req: Request, res: Response) => {
  try {
    const { cus_id, total_price, order_description, staff_id } = req.body;

    if (!cus_id || !total_price) {
      return res.status(400).json("Thiếu trường bắt buộc!");
    }

    const newOrder = await Order.create({
      cus_id,
      total_price,
      order_description,
      staff_id,
      status: "Waiting for payment",
      was_paid: false, 
    });

    return res.status(201).json({
      message: "Payment by QR code",
      orderId: newOrder._id,
      totalAmount: newOrder.total_price,
    });
  } catch (error) {
    console.log("Error creating payment order by QR: ", error);
    return res.status(500).json("Error system!");
  }
};
