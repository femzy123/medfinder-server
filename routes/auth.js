const router = require("express").Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const winston = require("winston");

const prisma = new PrismaClient();

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/auth.log" }),
  ],
});

router.post("/register", async (req, res) => {
  const { name, email, password, phone, type, role } = req.body;
  const newUser = {
    name,
    email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    phone,
    type,
    role,
  };
  logger.debug(req.body);
  if (!name || !email || !password || !phone || !type || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  try {
    const user = await prisma.user.create({
      data: newUser,
    });
    const { password, ...info } = user;
    res.status(201).json({ response: "User created successfully", data: info });
  } catch (err) {
    logger.error(err.message);
    var message;
      if (err.code === "P2002") {
        message = "A new user cannot be created with this email";
      } else {
        message = err.message
      }
    res.status(500).json({ message: message, ...err });
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    !user && res.status(401).json({ message: "Wrong email or password" });

    const { password, ...info } = user;

    const decryptedPassword = CryptoJS.AES.decrypt(
      password,
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    decryptedPassword !== req.body.password &&
      res.status(401).json({ message: "Wrong email or password" });

    const accessToken = jwt.sign({ id: info.id }, process.env.SECRET_KEY, {
      expiresIn: "5d",
    });
    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    res.status(500).json("Something went wrong!");
  }
});

module.exports = router;
