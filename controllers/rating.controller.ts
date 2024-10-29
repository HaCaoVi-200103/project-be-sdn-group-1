import { Request, Response } from "express";
import { checkCakeById, checkRatingById, checkRatingCake, checkUserById } from "../utils";
import Rating from "../models/rating";
import mongoose from "mongoose";

export const createRatingCake = async (req: Request, res: Response) => {
    try {
        const { cakeId, rating_value, rating_comment, user_id } = req.body;

        if (!cakeId || !rating_value || !rating_comment || !user_id) {
            return res.status(400).json("Missing required field!!!")
        }

        const checkCake = await checkCakeById(cakeId);

        if (!checkCake) {
            return res.status(404).json("Cake Id not found")
        }

        const checkUser = await checkUserById(user_id);

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

export const updateRatingCake = async (req: Request, res: Response) => {
    try {
        const { ratingId } = req.params

        if (!ratingId) {
            return res.status(400).json("Missing required params!!!")
        }

        const { cakeId, rating_value, rating_comment, user_id } = req.body;

        if (!cakeId || !rating_value || !rating_comment || !user_id) {
            return res.status(400).json("Missing required field!!!")
        }

        const checkCake = await checkCakeById(cakeId);

        if (!checkCake) {
            return res.status(404).json("Cake Id not found")
        }

        const checkUser = await checkUserById(user_id);

        if (!checkUser) {
            return res.status(404).json("User Id not found")
        }

        const compare = await checkRatingCake(cakeId, user_id, ratingId)

        if (!compare) {
            return res.status(403).send("You do not have permission to edit!!!")
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

        const checkCake = await checkCakeById(cakeId);

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

export const getRatingById = async (req: Request, res: Response) => {
    try {
        const { ratingId } = req.params;
        if (!ratingId) {
            return res.status(400).json("Missing required params!!!")
        }

        const check = await checkRatingById(ratingId);

        if (!check) {
            return res.status(404).json("Rating Id not found")
        }

        return res.status(200).json(check)
    } catch (error) {
        console.log("Get Rating Cake Error: ", error);
        return res.status(500).json("Internal Server Error")
    }
}

export const deleteRatingById = async (req: Request, res: Response) => {
    try {
        const { ratingId } = req.params;

        if (!ratingId) {
            return res.status(400).json("Missing required params!!!")
        }

        const check = await checkRatingById(ratingId);

        if (!check) {
            return res.status(404).json("Rating Id not found")
        }

        await Rating.findByIdAndDelete(ratingId)

        return res.status(200).json({ message: "Delete Success" })
    } catch (error) {
        console.log("Get Rating Cake Error: ", error);
        return res.status(500).json("Internal Server Error")
    }
}  