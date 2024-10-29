import { Request, Response } from "express";
import { checkCakeById } from "../../utils";
import Rating from "../../models/rating";

export const createRatingCake = async (req: Request, res: Response) => {
    try {
        const { id, rating_value, rating_comment, user_id } = req.body;

        if (!id || !rating_value || !rating_comment || !user_id) {
            return res.status(400).json("Missing required field!!!")
        }

        const checkCake = checkCakeById(id);

        if (!checkCake) {
            return res.status(404).json("Cake Id not found")
        }

        const rating = await Rating.create({ cake_id: id, rating_comment: rating_comment, rating_value: rating_value, user_id: user_id })

    } catch (error) {
        console.log("Create Cake Error: ", error);
        return res.status(500).json("Internal Server Error")

    }
}