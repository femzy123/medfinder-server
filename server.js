const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user")
const professionalRoute = require("./routes/professional")
const institutionRoute = require("./routes/institution");

const app = express();
app.use(cors());
dotenv.config();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server works fine!");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/professional", professionalRoute);
app.use("/api/institution", institutionRoute);

app.listen(5000, () => console.log("Server started on http://localhost:5000"));

module.exports = app;