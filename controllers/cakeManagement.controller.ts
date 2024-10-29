import { NextFunction, Request, Response } from "express";
import Cake from "../models/cake";
import { uploadFile } from "./uploadFile";

export const getAllCakes = async (req: Request, res: Response) => {
  try {
    const cakes = await Cake.find();
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
      res.status(400).json({ message: "No file uploaded." });
      return;
    }

    const uploadResponse = await uploadFile(
      req,
      res,
      async () => {},
      "CakeImages"
    );

    if (uploadResponse && uploadResponse.status === 200) {
      const { downloadURL } = uploadResponse.data;

      const newCake = await Cake.create({
        ...req.body,
        cake_image: downloadURL,
      });
      res.status(200).json({ message: "Cake added successfully." });
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
    const deletedCake = await Cake.findByIdAndDelete(id);

    if (!deletedCake) {
      return res.status(404).json({ message: "Cake not found." });
    }

    return res.status(200).json({ message: "Cake deleted successfully." });
  } catch (error) {
    console.error("Error deleting cake:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
