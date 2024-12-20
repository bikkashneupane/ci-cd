import mongoose, { Document, Schema, Model } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const schema: Schema<IUser> = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
});

export const UserModel: Model<IUser> = mongoose.model("User", schema);