const router = require("express").Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const {faker} = require("@faker-js/faker");

const prisma = new PrismaClient();



router.post("/", async (req, res) => {
  const users = await prisma.user.findMany();
  
  const userIds = users.map((user) => user.id);

  const professionals = [];

  for (let i = 0; i < 6; i++) {
    professionals.push({
      address: {
        street: faker.address.streetAddress(true),
        city: faker.address.city(),
        state: faker.address.state(),
      },
      country: faker.address.country(),
      specialty: faker.name.jobType(),
      institution: faker.company.companyName(),
      geolocation: {
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      },
      website: faker.internet.url(),
      bio: faker.lorem.paragraph(),
      userId: userIds[i],
      education: [
        {
          institutionName: faker.company.name(),
          degree: faker.name.jobTitle(),
          fieldOfStudy: faker.lorem.word(),
          startYear: 2010,
          endYear: 2014,
        },
        {
          institutionName: faker.company.name(),
          degree: faker.name.jobTitle(),
          fieldOfStudy: faker.lorem.word(),
          startYear: 2014,
          endYear: 2016,
        },
      ],
      experience: [
        {
          institutionName: faker.company.name(),
          position: faker.name.jobTitle(),
          startYear: 2016,
          endYear: 2018,
        },
        {
          institutionName: faker.company.name(),
          position: faker.name.jobTitle(),
          startYear: 2018,
          endYear: 2020,
        },
      ],
      certifications: [
        {
          title: faker.lorem.word(),
          description: faker.lorem.sentence(),
          photoURL: faker.image.imageUrl(),
        },
        {
          title: faker.lorem.word(),
          description: faker.lorem.sentence(),
          photoURL: faker.image.imageUrl(),
        },
      ],
    });
  }

  professionals.map(async (prof, i) => {
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
      userId,
    } = prof;

    try {
      await prisma.professional.create({
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
      console.log("Professional seeded successfully");
    } catch (error) {
      console.log("prof", error);
    }
  });

  const institutions = [];

  for (let i = 0; i < 5; i++) {
    institutions.push({
      address: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
      },
      country: faker.address.country(),
      institutionType: faker.lorem.word(),
      geolocation: {
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      },
      website: faker.internet.url(),
      services: [faker.lorem.words(), faker.lorem.words(), faker.lorem.words()],
      userId: userIds[6 + i],
    });
  }

  institutions.map(async (inst, i) => {
    const {
      bio,
      address,
      country,
      institutionType,
      geolocation,
      website,
      services,
      userId,
    } = inst;

    try {
      await prisma.institution.create({
        data: {
          userId,
          bio,
          address,
          country,
          institutionType,
          geolocation,
          website,
          services,
        },
      });
      console.log("Institution successfully seeded");
    } catch (error) {
      console.log("inst\n", error);
    }
  });

  res.send("Seeding Done")
})

module.exports = router;