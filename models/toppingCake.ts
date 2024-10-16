import mongoose, { Schema } from "mongoose";

const toppingCakeSchema = new Schema({
    tc_quantity: { type: Number, required: true, min: 0 },
    tc_price: { type: Number, required: true, min: 0 },
    topping_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "toppings" },
    cio_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "cateinorders" },
})

const ToppingCake = mongoose.model("toppingcakes", toppingCakeSchema)

export default ToppingCake;