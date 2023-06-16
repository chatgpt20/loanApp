const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const db = require("./controllers/firebaseAdmin");
require('dotenv').config();

// ----------------------------- Routes ----------------------------------------------------
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const viewRoutes = require("./routes/viewRoutes");
const otherRoutes = require("./routes/otherRoutes");

// ----------------------------- Middilewares -----------------------------------------------
const { requireAuth } = require("./middleware/authMiddleware");

const app = express();
app.set("view engine", "ejs");

// app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// ------------------------ Using Routes --------------------------------------------------------
app.use(authRoutes);
app.use(paymentRoutes);
app.use(viewRoutes);
app.use(otherRoutes);

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
