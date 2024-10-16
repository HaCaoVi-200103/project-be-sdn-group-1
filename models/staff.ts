import { genSalt, hash } from "bcrypt";
import mongoose, { Schema } from "mongoose";

const staffSchema = new Schema({
    staff_name: { type: String, required: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    full_name: { type: String, required: true },
    is_staff: { type: Boolean, default: false },
    staff_avatar: { type: String, required: true },
    address: { type: String, required: true }
})

staffSchema.pre("save", async function (next) {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
    next();
})

const Staff = mongoose.model("staffs", staffSchema)

export default Staff;
