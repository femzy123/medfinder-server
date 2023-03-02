const router = require("express").Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const winston = require("winston");
const verify = require("../middlewares/verifyAuth");

const prisma = new PrismaClient();

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/professional.log" }),
  ],
});

router.post("/:id", async (req, res, next) => {
  const {
    address,
    country,
    specialty,
    institution,
    geolocation,
    website,
    bio,
    education,
    experience,
    certifications,
  } = req.body;
  const userId = req.params.id;

  logger.debug(req.body);

  if (
    !address ||
    !country ||
    !specialty ||
    !institution ||
    !bio ||
    !education ||
    !experience
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newProfessional = await prisma.professional.create({
      data: {
        userId,
        address,
        country,
        specialty,
        institution,
        geolocation,
        website,
        bio,
        education,
        experience,
        certifications,
      },
    });
    logger.info("Professional created successfully");
    res.status(201).json({
      message: "Professional created successfully",
      data: newProfessional,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.use((error, req, res, next) => {
  if (error.name === "ValidationError") {
    res.status(422).json({ error: error.message });
  } else {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const profile = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { Professional: true },
    });
    const { password, role, ...info } = profile;
    res.status(200).json({ data: info });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

// Update User's Professional Profile
router.put("/:id/professional", verify, async (req, res, next) => {
  if (req.user.id === req.params.id || req.user.role === "ADMIN") {
    try {
      const professional = await prisma.professional.update({
        where: { userId: req.params.id },
        data: req.body,
      });
      res.status(200).json({
        message: "Professional updated succesfully",
        data: professional,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  } else {
    res.status(401).json({ message: "You are not authorized!" });
  }
});

module.exports = router;
