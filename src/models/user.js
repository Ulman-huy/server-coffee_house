const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    cart: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    location: { type: String, default: "" },
    verifyToken: { type: String },
    verify: { type: Boolean },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    forgotToken: {
      type: String,
    },
    role: {
      type: String,
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("user", userSchema);
module.exports = {
  User: User,
};
