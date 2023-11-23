const productRouter = require("./product");
const authRouter = require("./auth");
const userRouter = require("./user");
const orderRouter = require("./order");
const siteRouter = require("./site");

const route = (app) => {
  app.use("/v1/api/product", productRouter);
  app.use("/v1/api/user", userRouter);
  app.use("/v1/api/order", orderRouter);
  app.use("/v1/api/auth", authRouter);
  app.use("/v1/api", siteRouter);
};

module.exports = route;
