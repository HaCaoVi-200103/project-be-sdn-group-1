import { Request, Response } from "express";
import { checkCakeById, checkUserById } from "../utils";
import Rating from "../models/rating";
import mongoose from "mongoose";

export const createRatingCake = async (req: Request, res: Response) => {
    try {
        const { cakeId, rating_value, rating_comment, user_id } = req.body;

        if (!cakeId || !rating_value || !rating_comment || !user_id) {
            return res.status(400).json("Missing required field!!!")
        }

        const checkCake = checkCakeById(cakeId);

        if (!checkCake) {
            return res.status(404).json("Cake Id not found")
        }

        const checkUser = checkUserById(user_id);

        if (!checkUser) {
            return res.status(404).json("User Id not found")
        }

        await Rating.create({ cake_id: cakeId, rating_comment: rating_comment, rating_value: rating_value, user_id: user_id })
        return res.status(200).send("Rating success")
    } catch (error) {
        console.log("Create Cake Error: ", error);
        return res.status(500).json("Internal Server Error")
    }
}

export const getRatingByCakeId = async (req: Request, res: Response) => {
    try {
        const { cakeId } = req.params;
        if (!cakeId) {
            return res.status(400).json("Missing required params!!!")
        }

        const checkCake = checkCakeById(cakeId);

        if (!checkCake) {
            return res.status(404).json("Cake Id not found")
        }

        const result = await Rating.find({ cake_id: new mongoose.Types.ObjectId(cakeId) })

        return res.status(200).json(result)
    } catch (error) {
        console.log("Get Rating Cake Error: ", error);
        return res.status(500).json("Internal Server Error")
    }
}