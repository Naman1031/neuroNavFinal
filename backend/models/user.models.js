import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    surveyData: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
