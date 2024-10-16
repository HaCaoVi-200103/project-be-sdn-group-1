import mongoose, { Schema } from "mongoose";

const cateInOrderSchema = new Schema({
    cio_quantity: { type: Number, required: true, min: 0 },
    cio_price: { type: Number, required: true, min: 0 },
    cake_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "cakes" },
    order_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "orders" },
    tc_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "toppingcakes" },
})

const CateInOrder = mongoose.model("cateinorders", cateInOrderSchema)

export default CateInOrder;