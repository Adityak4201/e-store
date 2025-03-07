const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
// const auth = require('./middleware/auth');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerDoc = require("../swagger.json");
const swaggerUi = require("swagger-ui-express");
const userrouter = require("./routes/user");
const profilerouter = require("./routes/profile");
const sellerrouter = require("./routes/sellerprofile");
const product = require("./routes/product");
const sellerproduct = require("./routes/Sellerproducts");
const visitorrouter = require("./routes/visitor");
const invoiceRouter = require("./routes/invoice");
const categoryRouter = require("./routes/category");
const imageRouter = require("./routes/multiImages");
const sellersubscriptionrouter = require("./routes/sellerSubscriptions");
const bookKeepingRouter = require("./routes/bookKeeping");

const port = process.env.PORT || "4000";
const app = express();

app.use(cookieParser());
app.use(cors());

mongoose.connect(
  "mongodb+srv://piyush:piyush2001@magi2.k3zwz.mongodb.net/test",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("I'm connected");
});

app.use("/uploads", express.static("uploads"));
app.use(express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ Status: "Server running" });
});

app.use("/user", userrouter);
app.use("/profile", profilerouter);
app.use("/sellerprofile", sellerrouter);
app.use("/products", product);
app.use("/sellerproduct/", sellerproduct);
app.use("/visitor", visitorrouter);
app.use("/invoice", invoiceRouter);
app.use("/category", categoryRouter);
app.use("/banner", imageRouter);
app.use("/sellerSubs", sellersubscriptionrouter);
app.use("/bookKeeping", bookKeepingRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.listen(port, () => {
  console.log(`connected to the port ${port}`);
});
