import { NextFunction, Request, Response } from "express";
import Cake from "../models/cake";
import { uploadFile } from "./uploadFile";
import GoWith from "../models/goWith";
import mongoose from "mongoose";
import { deleteFile } from "../config/FirebaseConfig";

export const getCake = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cake = await Cake.findById(id);
    return res.status(200).json(cake);
  } catch (error) {
    console.error("Error fetching cakes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSomeCakes = async (req: Request, res: Response) => {
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
    const cakes = await Cake.find()
      .skip(start)
      .limit(end - start);
    return res.status(200).json(cakes);
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

    const updatedCake = await Cake.findByIdAndUpdate(
      id,
      { ...req.body, cake_image: updatedImageURL },
      { new: true }
    );

    if (!updatedCake) {
      return res.status(500).json({ message: "Failed to update cake." });
    }

    return res
      .status(200)
      .json({ message: "Cake updated successfully.", updatedCake });
  } catch (error) {
    console.error("Error updating cake:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchCakes = async (req: Request, res: Response) => {
  const start = parseInt(req.body.start, 10);
  const end = parseInt(req.body.end, 10);
  const cakeName = req.body.cake_name ? req.body.cake_name : "";

  if (isNaN(start) || isNaN(end) || start < 0 || end <= start) {
    return res.status(400).json({ error: "Invalid start or end values." });
  }

  try {
    const query = cakeName
      ? { cake_name: { $regex: cakeName, $options: "i" } }
      : {};

    const cakes = await Cake.find(query)
      .skip(start)
      .limit(end - start);

    return res.status(200).json(cakes);
  } catch (error) {
    console.error("Error searching cakes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const filterCakesByPriceOrType = async (req: Request, res: Response) => {
  const start = parseInt(req.body.start, 10);
  const end = parseInt(req.body.end, 10);
  const typeFilter = req.body.type_filter;
  let query: any = {};

  console.log(start, end, typeFilter);

  if (isNaN(start) || isNaN(end) || start < 0 || end <= start) {
    return res.status(400).json({ error: "Invalid start or end values." });
  }

  try {
    if (typeFilter === "price") {
      const minPrice = parseFloat(req.body.min_price);
      const maxPrice = parseFloat(req.body.max_price);

      if (
        isNaN(minPrice) ||
        isNaN(maxPrice) ||
        minPrice < 0 ||
        maxPrice < minPrice
      ) {
        return res.status(400).json({ error: "Invalid price values." });
      }

      query = {
        cake_price: { $gte: minPrice, $lte: maxPrice },
      };
    } else if (typeFilter === "type") {
      const cakeType = req.body.cake_type;

      if (!cakeType) {
        return res.status(400).json({ error: "Cake type is required." });
      }

      query = {
        cake_type: cakeType,
      };
    } else {
      return res.status(400).json({ error: "Invalid type_filter value." });
    }

    const cakes = await Cake.find(query)
      .skip(start)
      .limit(end - start);

    return res.status(200).json(cakes);
  } catch (error) {
    console.error("Error filtering cakes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
