import { Request, Response } from "express";
import Cake from "../models/cake";

export const getCakesByType = async (req: Request, res: Response) => {
  try {
    const uniqueCakeTypes = await Cake.distinct("cake_type");
    const cakes = await Promise.all(
      uniqueCakeTypes.map(async (type) => {
        const records = await Cake.find({ cake_type: type })
          .select("cake_image cake_description cake_type -_id")
          .limit(5);
        if (records.length > 0) {
          return {
            cake_type: type,
            cake_description: records[0].cake_description, 
            images: records.map(record => record.cake_image), 
          };
        }
      })
    );
    return res.json(cakes.filter(cake => cake));
  } catch (error) {
    console.error("Error retrieving cakes by type:", error);
    return res.status(500).json({ message: "ERROR" });
  }
};

  export const getFirstCakeTypes = async (req: Request, res: Response)=> {
    try {
      const cakes = await Cake.find().select("cake_type cake_description cake_image -_id"); 
      return res.json(cakes); 
    } catch (error) {
      res.status(500).json({ message: "Đã xảy ra lỗi khi lấy dữ liệu loại bánh." });
    }
  };


  export const getAllCakes = async (req: Request, res: Response) => {
    try {
      const cakes = await Cake.find(); 
      return res.json(cakes);
    } catch (error) {
      console.error("Error retrieving all cakes:", error);
      return res.status(500).json({ message: "ERROR" });
    }
  };


  export const viewCakeDetail = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; 
      const cakes = await Cake.findById(id); 
      if (!cakes) {
        res.status(404).json({ message: "Cake not found!" })
        return;
      }
      res.json(cakes); 
    } catch (error) {
      res.status(500).json({ message: "Failed!" });
    }
  };

