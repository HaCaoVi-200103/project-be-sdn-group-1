import { Request, Response } from "express";
import Order from "../models/order";
import { checkOrderById } from "../utils";
import CakeInOrder from "../models/cakeInOrder";
import Cake from "../models/cake";
import Topping from "../models/topping";
import ToppingCake from "../models/toppingCake";
import { or } from "firebase/firestore";

const staff_id_ex = "6720a5c3588e2bd477bfd1c4";

// input: order_id
// output: add staff_id vào order
export const acceptOrder = async (req: Request, res: Response) => {
  try {
    const order = await checkOrderById(req.body.order_id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }

    const updateResult = await Order.updateOne(
      { _id: req.body.order_id, staff_id: null },
      { staff_id: staff_id_ex }
    );

    if (updateResult.modifiedCount === 0) {
      return res
        .status(400)
        .json("Order already accepted by another staff member");
    }

    return res.status(200).json("Accept Order Successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// input: start,end (thứ tự đầu tiên và cuối cùng muốn lấy trong data),status,wasPaid,flag
// output: list order
export const filterOrder = async (req: Request, res: Response) => {
  try {
    const { status, wasPaid, start, end, flag, search } = req.body;

    const validStatuses = ["All", "Pending", "Shipping", "Done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    console.log(wasPaid);
    if (typeof wasPaid !== "string" && typeof wasPaid !== "boolean") {
      return res
        .status(400)
        .json({ message: "'wasPaid' must be All, true or false" });
    }

    if (
      typeof start !== "number" ||
      typeof end !== "number" ||
      start <= 0 ||
      end < start
    ) {
      return res.status(400).json({ message: "Invalid pagination values" });
    }
    let orderQuery: any = {};
    if (wasPaid !== "All") {
      orderQuery.was_paid = wasPaid;
    }
    if (flag === "confirmed") {
      orderQuery.staff_id = staff_id_ex;
    } else if (flag === "unconfirmed") {
      orderQuery.staff_id = null;
    } else if (flag !== "all") {
      return res.status(400).json({ message: "Invalid flag value" });
    }
    if (status !== "All") {
      orderQuery.status = status;
    }
    let orders = await Order.find(orderQuery)
      .populate("cus_id")
      .populate("staff_id");
    if (search) {
      orders = orders.filter((order) => {
        const customer = order.cus_id as any;
        return (
          customer &&
          customer.full_name &&
          customer.full_name.toLowerCase().includes(search.toLowerCase())
        );
      });
    }
    const totalCount = orders.length;
    return res.status(200).json({ totalCount, orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// input: start,end (thứ tự đầu tiên và cuối cùng muốn lấy trong data),search,flag (all,confirmed,unconfirmed)
// output: list order
export const searchOrder = async (req: Request, res: Response) => {
  try {
    const { flag, search, start, end } = req.body;
    let orderQuery: any = {};
    if (
      typeof start !== "number" ||
      typeof end !== "number" ||
      start <= 0 ||
      end < start
    ) {
      return res.status(400).json({ message: "Invalid pagination values" });
    }
    if (flag === "all") {
      orderQuery = {};
    } else if (flag === "confirmed") {
      orderQuery = { staff_id: staff_id_ex };
    } else if (flag === "unconfirmed") {
      orderQuery = { staff_id: null };
    } else {
      return res.status(400).json("Bad Request");
    }
    console.log(flag, search, start, end);
    let orders = await Order.find(orderQuery)
      .populate("cus_id")
      .populate("staff_id");
    if (search) {
      orders = orders.filter((order) => {
        const customer = order.cus_id as any;
        return (
          customer &&
          customer.full_name &&
          customer.full_name.toLowerCase().includes(search.toLowerCase())
        );
      });
    }
    const totalCount = orders.length;
    // console.log(orders)
    orders = orders.slice(start - 1, end);
    console.log({ orders, totalCount });
    return res.status(200).json({ orders, totalCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// input: start,end (thứ tự đầu tiên và cuối cùng muốn lấy trong data)
// output: list order
export const getAllOrder = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.body;
    if (
      typeof start !== "number" ||
      typeof end !== "number" ||
      start <= 0 ||
      end < start
    ) {
      return res.status(400).json({ message: "Invalid pagination values" });
    }
    const totalCount = await Order.countDocuments();
    const orders = await Order.find()
      .populate("cus_id")
      .populate("staff_id")
      .skip(start - 1)
      .limit(end - (start - 1));
    return res.status(200).json({ orders, totalCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// input: start,end (thứ tự đầu tiên và cuối cùng muốn lấy trong data)
// output: list order mà đã có staff_id
export const getConfirmedOrder = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.body;
    if (
      typeof start !== "number" ||
      typeof end !== "number" ||
      start <= 0 ||
      end < start
    ) {
      return res.status(400).json({ message: "Invalid pagination values" });
    }
    const totalCount = await Order.countDocuments({ staff_id: staff_id_ex });
    const orders = await Order.find({ staff_id: staff_id_ex })
      .populate("cus_id")
      .populate("staff_id")
      .skip(start - 1)
      .limit(end - (start - 1));
    return res.status(200).json({ orders, totalCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// input: start,end (thứ tự đầu tiên và cuối cùng muốn lấy trong data)
// output: list order mà chưa có staff_id
export const getUnconfirmedOrder = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.body;
    if (
      typeof start !== "number" ||
      typeof end !== "number" ||
      start <= 0 ||
      end < start
    ) {
      return res.status(400).json({ message: "Invalid pagination values" });
    }
    const totalCount = await Order.countDocuments({ staff_id: undefined });
    const orders = await Order.find({ staff_id: undefined })
      .populate("cus_id")
      .populate("staff_id")
      .skip(start - 1)
      .limit(end - (start - 1));
    return res.status(200).json({ orders, totalCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
// input: order_id
// output: chuyển was_paid thành true
export const wasPaidOrder = async (req: Request, res: Response) => {
  try {
    const orders = await checkOrderById(req.body.order_id);
    if (!orders) {
      return res.status(404).json("Order Not Found");
    }
    await Order.updateOne({ _id: req.body.order_id }, { was_paid: true });
    return res.status(200).json("Updated Was Paid Successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
// input: status mới phải 1 trong 3 trạng thái Pending,Shipping,Done và order_id
// output: chuyển status cũ thành status mới
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const validStatuses = ["Pending", "Shipping", "Done"];

    const { order_id, status } = req.body;
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json("Invalid status. Must be one of: Pending, Shipping, Done");
    }

    const order = await checkOrderById(order_id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    }
    await Order.updateOne({ _id: order_id }, { status });
    return res.status(200).json("Updated Status Successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getOrderByID = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let order: any = await checkOrderById(id);
    if (!order) {
      return res.status(404).json("Order Not Found");
    } else {
      order = await Order.findById(order._id).populate("cus_id");
    }
    const cakeInOrders = await CakeInOrder.find({ order_id: order?._id });

    const listOrderItem = await Promise.all(
      cakeInOrders.map(async (cakeInOrder) => {
        const toppingCakes = await ToppingCake.find({
          cio_id: cakeInOrder._id,
        });

        const toppings = await Promise.all(
          toppingCakes.map(async (toppingCake) => {
            return await Topping.findById(toppingCake.topping_id);
          })
        );

        const cake = await Cake.findById(cakeInOrder.cake_id);

        // Merge cake and cakeInOrder into a single object
        const mergedCakeInfo = {
          ...cakeInOrder.toObject(), // Convert mongoose document to plain object
          cake: cake,
        };

        // Merge toppings and toppingCakes into a single array
        const mergedToppingsInfo = toppingCakes.map((toppingCake, index) => ({
          toppingCake: toppingCake,
          topping: toppings[index],
        }));

        return {
          ...mergedCakeInfo,
          toppings: mergedToppingsInfo,
        };
      })
    );

    console.log({ listOrderItem, order });
    return res.status(200).json({ listOrderItem, order });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
