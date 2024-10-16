import mongoose, { Schema } from "mongoose";

const goWithSchema = new Schema({
    cate_id: { type: String, required: true },
    topping_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "toppings" },
    cake_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "cakes" },
})

const GoWith = mongoose.model("gowiths", goWithSchema);

export default GoWith;