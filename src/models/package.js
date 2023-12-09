const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    userId: { type: String },
    name: { type: String },
    phone: { type: String },
    location: { type: String },
    message: { type: String },
    status: { type: String, default: "PENDING" },
    price: { type: Number },
    cart: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Package = mongoose.model("package", packageSchema);

module.exports = {
  Package: Package,
};
