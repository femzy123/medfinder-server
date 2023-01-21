const router = require("express").Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  console.log(req.body);
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    phone: req.body.phone,
    role: req.body.role,
    address: req.body.address,
    country: req.body.country
  };
  try {
    const user = await prisma.users.create({
      data: newUser,
    });
    const { password, ...info } = user;
    res.status(201).json({ response: "User created successfully", data: info });
  } catch (err) {
    var message;
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (err.code === "P2002") {
        message = "A new user cannot be created with this email";
      }
    }
    res.status(500).json({ message: message, ...err });
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
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
