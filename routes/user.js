const router = require("express").Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const winston = require("winston");
const verify = require("../verifyToken");

const prisma = new PrismaClient();

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/users.log" }),
  ],
});

router.use((error, req, res, next) => {
  if (error.name === "ValidationError") {
    res.status(422).json({ error: error.message });
  } else {
    res.status(500).json({ error: error.message });
  }
});


// Update User
router.put("/:id", verify, async (req, res, next) => {
  logger.debug(req.body);

  if (req.user.id === req.params.id || req.user.role === "ADMIN") {
    try {
      const user = await prisma.user.update({
        where: { userId: req.params.id },
        data: req.body,
      });
      logger.info("User updated succesfully");
      res
        .status(200)
        .json({ message: "User updated succesfully" });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  } else {
    logger.error("You are not authorized!")
    res.status(401).json({ message: "You are not authorized!" });
  }
});


// Delete a user account
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.role === "ADMIN") {
    try {
      await prisma.user.delete({
        where: {
          id: req.params.id,
        },
      });
      logger.info("Account deleted successfully");
      res.send("Account deleted successfully");
    } catch (error) {
      logger.error(error)
      res.status(500).json({ message: "Account not found" });
    }
  } else {
    logger.error("You are not authorized!");
    res.status(401).json({ message: "You are not authorized" });
  }
});

module.exports = router;