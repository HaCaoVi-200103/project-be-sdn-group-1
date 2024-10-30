import { Request, Response } from "express";
import Cake from "../models/cake";


export const addToCart = async (req: Request, res: Response) => {
  const { cakeId, quantity } = req.body;
  try {
    const cake = await Cake.findById(cakeId);
    if (!cake) {
      return res.status(404).json({ message: "Cake not found" });
    }

    (req.session as any).cart = (req.session as any).cart || [];
    const existingItemIndex = (req.session as any).cart.findIndex(
      (item: any) => item.cakeId === cakeId
    );

    if (existingItemIndex >= 0) {
      (req.session as any).cart[existingItemIndex].quantity += quantity;
    } else {
      (req.session as any).cart.push({
        cakeId,
        quantity,
        cake_name: cake.cake_name,
        cake_price: cake.cake_price,
        cake_image: cake.cake_image,
      });
    }
    console.log("Current cart:", (req.session as any).cart);
    res.status(200).json({ message: "Added to cart successfully", cart: (req.session as any).cart });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while adding to cart", error });
  }
};


export const editCart = (req: Request, res: Response) => {
  const { cakeId, quantity } = req.body;
  (req.session as any).cart = (req.session as any).cart || [];
  const itemIndex = (req.session as any).cart.findIndex(
    (item: any) => item.cakeId === cakeId
  );
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }
  if (quantity <= 0) {
    (req.session as any).cart.splice(itemIndex, 1);
  } else {
    (req.session as any).cart[itemIndex].quantity = quantity;
  }
  res.status(200).json({ message: "Cart updated successfully", cart: (req.session as any).cart });
};
