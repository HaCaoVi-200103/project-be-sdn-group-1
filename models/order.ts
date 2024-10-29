import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    order_date: { type: Date, required: true, default: Date.now },
    total_price: { type: Number, required: true, min: 0 },
    was_paid: { type: Boolean, default: false },
    received_date: { type: Date, default: null },
    order_description: { type: String, default: "" },
    cus_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "customers" },
    staff_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "staffs" },
})

const Order = mongoose.model("orders", orderSchema)

export default Order;