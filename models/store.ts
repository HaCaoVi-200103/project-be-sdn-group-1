import mongoose, { Schema } from "mongoose";

const storeSchema = new Schema({
    store_name: { type: String, required: true },
    open_hours: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true },
    phone_number: { type: String, required: true },

});

const Store = mongoose.model("stores", storeSchema);

export default Store;
