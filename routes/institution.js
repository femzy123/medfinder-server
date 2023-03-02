const router = require("express").Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const winston = require("winston");
const verify = require("../middlewares/verifyAuth");

const prisma = new PrismaClient();

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/institutions.log" }),
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
    const newInstitution = await prisma.institution.create({
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
    logger.info("Institution created successfully");
    res.status(201).json({
      message: "Institution created successfully",
      data: newInstitution,
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
      include: { Institution: true },
    });
    const { password, role, ...info } = profile;
    res.status(200).json({ data: info });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

// Update User's Institution Profile
router.put("/:id/institution", verify, async (req, res, next) => {
  if (req.user.id === req.params.id || req.user.role === "ADMIN") {
    try {
      const institution = await prisma.institution.update({
        where: { userId: req.params.id },
        data: req.body,
      });
      res.status(200).json({
        message: "Institution updated succesfully",
        data: institution,
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
