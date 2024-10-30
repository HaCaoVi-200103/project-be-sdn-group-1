import { Request, Response } from "express";
import Order from "../models/order";

// input: start,end (thứ tự đầu tiên và cuối cùng muốn lấy trong data)
// output: list order mà đã có staff_id 
export const getConfirmedOrder = async (req: Request, res: Response) => {
    try {
        const order = await Order.find({ staff_id: { $ne: undefined } })
        .populate('cus_id')
        .populate('staff_id');
        const data=order.splice(req.body.start-1,req.body.end)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

// input: start,end (thứ tự đầu tiên và cuối cùng muốn lấy trong data)
// output: list order mà chưa có staff_id
export const getUnconfirmedOrder = async (req: Request, res: Response) => {
    try {
        const order = await Order.find({staff_id:undefined}).populate('cus_id').populate('staff_id');
        const data=order.splice(req.body.start-1,req.body.end)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
// input: order_id
// output: chuyển was_paid thành true
export const wasPaidOrder = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.body.order_id);
        if (order) {
            await Order.updateOne({ _id: req.body.order_id }, { was_paid: true });
            res.status(200).json("Updated Was Paid Successfully");
        } else {
            res.status(404).json("Order Not Found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
// input: status mới phải 1 trong 3 trạng thái Pending,Shipped,Delivered và order_id
// output: chuyển status cũ thành status mới
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const validStatuses = ['Pending', 'Shipped', 'Delivered']; 
        
        const { order_id, status } = req.body;
        if (!validStatuses.includes(status)) {
            return res.status(400).json("Invalid status. Must be one of: Pending, Shipped, Delivered");
        }

        const order = await Order.findById(order_id);
        if (order) {
            await Order.updateOne({ _id: order_id }, { status });
            res.status(200).json("Updated Status Successfully");
        } else {
            res.status(404).json("Order Not Found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};


