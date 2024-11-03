import { NextFunction, Request, Response } from "express";
import Topping from "../models/topping";
import { uploadFile } from "./uploadFile";
import GoWith from "../models/goWith";
import mongoose from "mongoose";
import { deleteFile } from "../config/FirebaseConfig";

export const getTopping = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const topping = await Topping.findById(id);
    return res.status(200).json(topping);
  } catch (error) {
    console.error("Error fetching Toppings:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSomeToppings = async (req: Request, res: Response) => {
  const start = parseInt(req.body.start);
  const end = parseInt(req.body.end);
  console.log(start, end);

  if (
    typeof start !== "number" ||
    typeof end !== "number" ||
    start < 0 ||
    end <= start
  ) {
    return res.status(400).json({ error: "Invalid start or end values." });
  }

  try {
    const Toppings = await Topping.find({ isDeleted: 0 })
      .skip(start)
      .limit(end - start);
    return res.status(200).json(Toppings);
  } catch (error) {
    console.error("Error fetching Toppings:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addToppings = async (
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
      "ToppingImages"
    );

    if (uploadResponse && uploadResponse.status === 200) {
      const { downloadURL } = uploadResponse.data;

      // Tạo bản ghi Topping mới
      const newTopping = await Topping.create({
        ...req.body,
        topping_image: downloadURL,
      });
      res.status(200).json({ message: "Topping added successfully." });
    } else {
      res.status(500).json({ message: "Error uploading file." });
    }
  } catch (error) {
    console.error("Error adding Topping:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteTopping = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTopping = await Topping.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedTopping) {
      return res.status(404).json({ message: "Topping not found." });
    }

    return res.status(200).json({
      message: "Topping deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting Topping:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTopping = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingTopping = await Topping.findById(id);
    if (!existingTopping) {
      return res.status(404).json({ message: "Topping not found." });
    }

    let updatedImageURL = existingTopping.topping_image;

    if (req.file) {
      if (existingTopping.topping_image) {
        await deleteFile(existingTopping.topping_image);
      }

      const uploadResponse = await uploadFile(
        req,
        res,
        async () => {},
        "ToppingImages"
      );
      if (uploadResponse && uploadResponse.status === 200) {
        updatedImageURL = uploadResponse.data.downloadURL;
      } else {
        return res.status(500).json({ message: "Error uploading file." });
      }
    }

    const updatedTopping = await Topping.findByIdAndUpdate(
      id,
      { ...req.body, topping_image: updatedImageURL },
      { new: true }
    );

    if (!updatedTopping) {
      return res.status(500).json({ message: "Failed to update Topping." });
    }

    return res
      .status(200)
      .json({ message: "Topping updated successfully.", updatedTopping });
  } catch (error) {
    console.error("Error updating Topping:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchAndFilterToppings = async (req: Request, res: Response) => {
  const start = parseInt(req.body.start, 10);
  const end = parseInt(req.body.end, 10);
  const toppingName = req.body.topping_name || "";
  let query: any = {};

  query.isDeleted = { $lte: 0 };

  if (isNaN(start) || isNaN(end) || start < 0 || end <= start) {
    return res.status(400).json({ error: "Invalid start or end values." });
  }

  try {
    // Search by topping name if provided
    if (toppingName) {
      query.topping_name = { $regex: toppingName, $options: "i" };
    }

    // Filter by price range if provided
    const minPrice = parseFloat(req.body.min_price);
    const maxPrice = parseFloat(req.body.max_price);
    if (
      !isNaN(minPrice) &&
      !isNaN(maxPrice) &&
      minPrice >= 0 &&
      maxPrice >= minPrice
    ) {
      query.topping_price = { $gte: minPrice, $lte: maxPrice };
    }

    const toppings = await Topping.find(query)
      .skip(start)
      .limit(end - start);

    const totalToppings = await Topping.countDocuments(query);

    return res.status(200).json({ totalToppings, toppings });
  } catch (error) {
    console.error("Error searching and filtering toppings:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
