import mongoose, { Schema } from "mongoose";

const toppingSchema = new Schema({
    topping_name: { type: String, required: true },
    topping_quantity: { type: Number, required: true, min: 0 },
    topping_price: { type: Number, required: true, min: 0 },
    topping_image: { type: String, required: true },
    topping_description: { type: String, required: true }
})

const Topping = mongoose.model("toppings", toppingSchema)

export default Topping;