import mongoose, { Schema } from "mongoose";
import { genSalt, hash } from "bcrypt";

const customerSchema = new Schema({
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String },
  address: { type: String },
  user_avatar: { type: String },
  google_id: { type: String, default: null },
});

customerSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

const Customer = mongoose.model("customers", customerSchema);

export default Customer;
