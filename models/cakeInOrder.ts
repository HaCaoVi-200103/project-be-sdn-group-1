import mongoose, { Schema } from "mongoose";

const cakeInOrderSchema = new Schema({
  cio_quantity: { type: Number, required: true, min: 0 },
  cio_price: { type: Number, required: true, min: 0 },
  cake_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "cakes",
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "orders",
  },
});

const CakeInOrder = mongoose.model("cakeinorders", cakeInOrderSchema);

export default CakeInOrder;
