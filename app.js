const bodyParser = require("body-parser");
const express = require("express");

app = express();

const userRouter = require("./Routes/userRoutes");
const clothesRouter = require("./Routes/clothesRoutes");
const messageRouter = require("./Routes/messageRoutes");
const offerRouter = require("./Routes/offerRoutes");

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use("/Clothing/Users", userRouter);
app.use("/Clothing/Clothes", clothesRouter);
app.use("/Clothing/Messages", messageRouter);
app.use("/Clothing/Offers", offerRouter);

module.exports = app;
