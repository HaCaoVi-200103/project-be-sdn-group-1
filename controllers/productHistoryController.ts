import { Request, Response } from "express";
import HistoryProduct from "../models/historyProduct";

export const getAllCakeHistory = async (req: Request, res: Response) => {
  try {
    const { search, start, end } = req.body;

    if (
      typeof start !== "number" ||
      typeof end !== "number" ||
      start <= 0 ||
      end < start
    ) {
      return res.status(400).json({ message: "Invalid pagination values" });
    }
    const totalCount = await HistoryProduct.countDocuments({
      cake_id: { $ne: null, $exists: true },
    });

    let productHistories = await HistoryProduct.find({ cake_id: { $ne: null, $exists: true },})
      .populate("cake_id")
      .populate("staff_id")

    if (search) {
      productHistories = productHistories.filter((history) => {
        const staff = history.staff_id as any;
        const cake = history.cake_id as any;
        return (
          (staff &&
            staff.full_name &&
            staff.full_name.toLowerCase().includes(search.toLowerCase())) ||
          (cake &&
            cake.cake_name &&
            cake.cake_name.toLowerCase().includes(search.toLowerCase()))
        );
      });
    }
    console.log(productHistories.length);
    productHistories = productHistories.slice(start - 1, end);
    console.log(totalCount);
    return res.status(200).json({
      total: totalCount,
      productHistories: productHistories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

export const getAllToppingHistory = async (req: Request, res: Response) => {
    try {
      const { search, start, end } = req.body;
  
      if (
        typeof start !== "number" ||
        typeof end !== "number" ||
        start <= 0 ||
        end < start
      ) {
        return res.status(400).json({ message: "Invalid pagination values" });
      }
      const totalCount = await HistoryProduct.countDocuments({
        topping_id: { $ne: null, $exists: true },
      });
  
      let productHistories = await HistoryProduct.find({ topping_id: { $ne: null, $exists: true },})
        .populate("topping_id")
        .populate("staff_id")
  
      if (search) {
        productHistories = productHistories.filter((history) => {
          const staff = history.staff_id as any;
          const topping = history.topping_id as any;
          return (
            (staff &&
              staff.full_name &&
              staff.full_name.toLowerCase().includes(search.toLowerCase())) ||
            (topping &&
              topping.topping_name &&
              topping.topping_name.toLowerCase().includes(search.toLowerCase()))
          );
        });
      }
      console.log(productHistories.length);
      productHistories = productHistories.slice(start - 1, end);
      console.log(totalCount);
      return res.status(200).json({
        total: totalCount,
        productHistories: productHistories,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred", error });
    }
  };