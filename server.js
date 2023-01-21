const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");

const app = express();
app.use(cors());
dotenv.config();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server works fine!");
});

app.use("/api/auth", authRoute);

app.listen(5000, () => console.log("Server started on http://localhost:5000"));
