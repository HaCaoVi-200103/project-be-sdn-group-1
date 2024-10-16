import mongoose, { Schema } from "mongoose";

const historyProductSchema = new Schema({
    his_quantity: { type: Number, required: true, min: 0 },
    create_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: null },
    create_by: { type: String, required: true },
    // update_by: { type: String, required: true },
    cake_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "cakes" },
    staff_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "staffs" },
    topping_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "toppings" },
})

const HistoryProduct = mongoose.model("history", historyProductSchema)

export default HistoryProduct;