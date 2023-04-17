const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter");
const bodyParser = require("body-parser");
const cors = require('cors')
dotenv.config();

const app = express();

mongoose
    .connect(process.env.DB_URL)
    .then(() =>
        console.log("connect success"))
    .catch((err) => {
        console.log(err);
    });

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
    });
app.use(express.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts",cartRouter);

app.listen(process.env.PORT || 8000, () => {
    console.log("Server is runing! port:"+process.env.PORT);
})
//hehe