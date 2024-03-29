const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    type: { type: String, default: "Coffee" },
    name: { type: String, required: true },
    brand: { type: String, default: "no brand" },
    price: { type: Number, required: true },
    star: { type: Number, default: 5 },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    sale: { type: Number, default: 0 },
    description: { type: String },
    sold: { type: Number, default: 0 },
    info: { type: String },
    images: { type: String },
    date: { type: Date },
    status: { type: String, default: "ACTIVE" },
    slug: { type: String, slug: "name" },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);
module.exports = {
  Product: Product,
};
