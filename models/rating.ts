import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema({
    rating_value: { type: String, required: true },
    rating_comment: { type: String, required: true },
    rating_date: { type: Date, default: Date.now },
    cake_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "cakes" },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "customers" },
})

const Rating = mongoose.model("ratings", ratingSchema)

export default Rating;