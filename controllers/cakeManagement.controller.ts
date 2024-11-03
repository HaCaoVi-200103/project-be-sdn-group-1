import { NextFunction, Request, Response } from "express";
import Cake from "../models/cake";
import { uploadFile } from "./uploadFile";
import GoWith from "../models/goWith";
import mongoose from "mongoose";
import { deleteFile } from "../config/FirebaseConfig";
import { checkCakeById } from "../utils";
import Order from "../models/order";
import CakeInOrder from "../models/cakeInOrder";

export const getCake = async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await checkCakeById(id);
  if (!order) {
    return res.status(404).json("Order Not Found");
  }

  try {
    const cake = await Cake.findById(id);
    if (!cake) {
      return res.status(404).json({ message: "Cake not found." });
    }

    // Lấy tất cả các topping có liên quan đến bánh
    const toppings = await GoWith.find({ cake_id: cake._id }).populate(
      "topping_id"
    );

    // Chuyển đổi mảng gowith thành mảng topping
    const toppingArray = toppings.map((gowith) => gowith.topping_id);

    return res.status(200).json({ cake, toppings: toppingArray });
  } catch (error) {
    console.error("Error fetching cake:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSomeCakes = async (req: Request, res: Response) => {
  const start = parseInt(req.body.start);
  const end = parseInt(req.body.end);

  if (
    typeof start !== "number" ||
    typeof end !== "number" ||
    start < 0 ||
    end <= start
  ) {
    return res.status(400).json({ error: "Invalid start or end values." });
  }

  try {
    const totalCakes = await Cake.countDocuments({ isDeleted: 0 });

    const cakes = await Cake.find({ isDeleted: 0 })
      .skip(start)
      .limit(end - start);

    return res.status(200).json({ totalCakes, cakes });
  } catch (error) {
    console.error("Error fetching cakes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addCakes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const uploadResponse = await uploadFile(
      req,
      res,
      async () => {},
      "CakeImages"
    );

    if (uploadResponse && uploadResponse.status === 200) {
      const { downloadURL } = uploadResponse.data;

      // Tạo bản ghi Cake mới
      const newCake = await Cake.create({
        ...req.body,
        cake_image: downloadURL,
      });

      // Lấy danh sách topping từ form-data và chuyển đổi sang ObjectId
      const toppingIds = Array.isArray(req.body.toppings)
        ? req.body.toppings
        : [req.body.toppings];

      const gowithRecords = toppingIds.map((toppingId: string) => ({
        cake_id: newCake._id,
        topping_id: new mongoose.Types.ObjectId(toppingId),
      }));

      await GoWith.insertMany(gowithRecords);

      res
        .status(200)
        .json({ message: "Cake added successfully with toppings." });
    } else {
      res.status(500).json({ message: "Error uploading file." });
    }
  } catch (error) {
    console.error("Error adding cake:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteCake = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await checkCakeById(id);
  if (!order) {
    return res.status(404).json("Order Not Found");
  }

  try {
    const deletedCake = await Cake.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedCake) {
      return res.status(404).json({ message: "Cake not found." });
    }

    return res.status(200).json({
      message: "Cake deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting cake:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCake = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingCake = await Cake.findById(id);
    if (!existingCake) {
      return res.status(404).json({ message: "Cake not found." });
    }

    let updatedImageURL = existingCake.cake_image;
    console.log(req.file);

    if (req.file) {
      if (existingCake.cake_image) {
        await deleteFile(existingCake.cake_image);
      }

      const uploadResponse = await uploadFile(
        req,
        res,
        async () => {},
        "CakeImages"
      );
      if (uploadResponse && uploadResponse.status === 200) {
        updatedImageURL = uploadResponse.data.downloadURL;
      } else {
        return res.status(500).json({ message: "Error uploading file." });
      }
    }
    console.log(req.body);

    const updatedCake = await Cake.findByIdAndUpdate(
      id,
      { ...req.body, cake_image: updatedImageURL },
      { new: true }
    );

    const deleteAllGowith = await GoWith.deleteMany({ cake_id: id });

    // Lấy danh sách topping từ form-data và chuyển đổi sang ObjectId
    const toppingIds = Array.isArray(req.body.toppings)
      ? req.body.toppings
      : [req.body.toppings];

    const gowithRecords = toppingIds.map((toppingId: string) => ({
      cake_id: id,
      topping_id: new mongoose.Types.ObjectId(toppingId),
    }));

    await GoWith.insertMany(gowithRecords);

    if (!updatedCake || !deleteAllGowith) {
      return res.status(500).json({ message: "Failed to update cake." });
    }

    return res.status(200).json({
      message: "Cake updated with topping successfully.",
      updatedCake,
    });
  } catch (error) {
    console.error("Error updating cake:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchAndFilterCakes = async (req: Request, res: Response) => {
  const start = parseInt(req.body.start, 10);
  const end = parseInt(req.body.end, 10);
  const cakeName = req.body.cake_name ? req.body.cake_name : "";
  let query: any = {};

  console.log(start, end, cakeName);

  if (isNaN(start) || isNaN(end) || start < 0 || end <= start) {
    return res.status(400).json({ error: "Invalid start or end values." });
  }

  try {
    if (cakeName) {
      query.cake_name = { $regex: cakeName, $options: "i" };
    }

    const minPrice = parseFloat(req.body.min_price);
    const maxPrice = parseFloat(req.body.max_price);
    if (
      !isNaN(minPrice) &&
      !isNaN(maxPrice) &&
      minPrice >= 0 &&
      maxPrice >= minPrice
    ) {
      query.cake_price = { $gte: minPrice, $lte: maxPrice };
    }

    const cakeType = req.body.cake_type;
    console.log("cake:", cakeType);

    if (cakeType && cakeType !== "All") {
      query.cake_type = cakeType;
    }

    const cakes = await Cake.find(query)
      .skip(start)
      .limit(end - start);

    const totalCakes = await Cake.countDocuments(query);

    return res.status(200).json({ totalCakes, cakes });
  } catch (error) {
    console.error("Error searching and filtering cakes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCakeTypes = async (req: Request, res: Response) => {
  try {
    const cakes = await Cake.find();
    const uniqueCakeTypes = [...new Set(cakes.map((cake) => cake.cake_type))];

    const cakeTypes = uniqueCakeTypes.map((type, index) => ({
      id: index.toString(),
      name: type,
    }));

    res.status(200).json(cakeTypes);
  } catch (error) {
    console.error("Error fetching cake types:", error);
    res.status(500).json({ message: "Error fetching cake types" });
  }
};

export const getMonthlySales = async (req: Request, res: Response) => {
  try {
    const month = parseInt(req.body.month as string) || new Date().getMonth();
    const year = parseInt(req.body.year as string) || new Date().getFullYear();

    console.log("month:", month);

    const orders = await Order.find({
      was_paid: true,
      order_date: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      },
    });

    const orderIds = orders.map((order) => order._id);

    const salesData = await CakeInOrder.aggregate([
      { $match: { order_id: { $in: orderIds } } },
      { $group: { _id: "$cake_id", totalSold: { $sum: "$cio_quantity" } } },
      {
        $lookup: {
          from: "cakes",
          localField: "_id",
          foreignField: "_id",
          as: "cake",
        },
      },
      { $unwind: "$cake" },
      {
        $project: {
          cake_name: "$cake.cake_name",
          totalSold: 1,
          cake_price: "$cake.cake_price",
          revenue: { $multiply: ["$totalSold", "$cake.cake_price"] },
        },
      },
    ]);

    res.status(200).json(salesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get monthly sales data" });
  }
};
