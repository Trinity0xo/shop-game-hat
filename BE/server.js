const express = require("express");
const mongoose = require("mongoose");
const { env } = require("./config/env");
const cors = require("cors");

const app = express();

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const cartRoute = require("./routes/cartRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const ratingRoute = require("./routes/ratingRoute");
const commentRoute = require("./routes/commentRoute");
const salesReportRoute = require("./routes/salesReportRoute");

const errorMiddleware = require("./middlewares/errorMiddleware");

// const { momo } = require("./test");

app.use(express.json());
app.use(cors());

mongoose
  .connect(env.MONGODB_URI)
  .then(() => console.log("connect to database successfully"))
  .catch((err) => {
    console.log("Can not connect DB");
    console.log(JSON.stringify(err, null, 2));
  });

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/rating", ratingRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/sale-report", salesReportRoute);

app.use(errorMiddleware);

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });
// app.use(express.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
// app.use(bodyParser.json());

// app.use("/api/products", productRouter);
// app.use("/api/carts", cartRouter);
// app.use("/api/oders", orderRouter);
// app.use("/api/ratings", ratingRouter);
// app.use("/api/comments", commentRouter);
// app.use("/api/sales-Reports", salesReportRouter);
// app.post("/api/momo", momo);

app.listen(env.SERVER_PORT, () => {
  console.log("Server is runing on port:" + env.SERVER_PORT);
});
