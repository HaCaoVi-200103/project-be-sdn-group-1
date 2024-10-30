import mongoose, { Schema } from "mongoose";

const cakeSchema = new Schema({
  cake_image: { type: String, required: true },
  cake_name: { type: String, required: true },
  cake_description: { type: String, required: true },
  cake_type: { type: String, required: true },
  cake_price: { type: Number, required: true, min: 0 },
  cake_quantity: { type: Number, required: true, min: 0 },
  isDeleted: {
    type: Number,
    default: false,
  },
});

const Cake = mongoose.model("cakes", cakeSchema);

export default Cake;
