const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    userId: { type: String },
    name: { type: String },
    phone: { type: String },
    location: { type: String },
    message: { type: String },
    status: { type: String, default: "PENDING" },
    cart: [],
  },
  {
    timestamps: true,
  }
);
const Package = mongoose.model("package", packageSchema);

module.exports = {
  Package: Package,
};
