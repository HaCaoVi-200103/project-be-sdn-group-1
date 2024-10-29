import mongoose, { Schema } from "mongoose";

const historyProductSchema = new Schema({
    his_quantity: { type: Number, required: true },
    his_price: { type: Number, required: true },
    create_date: { type: Date, default: null },
    update_date: { type: Date, default: null },
    create_by: { type: String },
    cake_id: { type: mongoose.Schema.Types.ObjectId, ref: "cakes" },
    staff_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "staffs" },
    topping_id: { type: mongoose.Schema.Types.ObjectId, ref: "toppings" },
})

const HistoryProduct = mongoose.model("history", historyProductSchema)

export default HistoryProduct;