import Cake from "../models/cake";
import { Request, Response } from "express";


export const getCakesByType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type } = req.query; 
        const query = type ? { cake_type: type } : {};
        const cakes = await Cake.find(query).select("cake_type cake_description cake_image -_id");
        res.json(cakes); 
      } catch (error) {
        res.status(500).json({ message: "ERROR" });
      }
  };

  export const getFirstCakeTypes = async (req: Request, res: Response): Promise<void> => {
    try {
      const cakes = await Cake.find().select("cake_type cake_description cake_image -_id"); 
      res.json(cakes); 
    } catch (error) {
      res.status(500).json({ message: "Đã xảy ra lỗi khi lấy dữ liệu loại bánh." });
    }
  };


  export const viewCakeDetail = async (req: Request, res: Response): Promise<void> => {
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

