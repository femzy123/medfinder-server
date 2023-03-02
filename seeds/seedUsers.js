const router = require("express").Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const {faker} = require("@faker-js/faker");

const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const users = [
    {
      id: "1",
      email: "user1@example.com",
      password: "password1",
      name: "User One",
      phone: "1234567890",
      type: "User",
      role: "admin",
    },
    {
      id: "2",
      email: "user2@example.com",
      password: "password2",
      name: "User Two",
      phone: "1234567891",
      type: "User",
      role: "user",
    },
    {
      id: "3",
      email: "user3@example.com",
      password: "password3",
      name: "User Three",
      phone: "1234567892",
      type: "User",
      role: "user",
    },
    {
      id: "4",
      email: "user4@example.com",
      password: "password4",
      name: "User Four",
      phone: "1234567893",
      type: "User",
      role: "user",
    },
    {
      id: "5",
      email: "user5@example.com",
      password: "password5",
      name: "User Five",
      phone: "1234567894",
      type: "User",
      role: "user",
    },
    {
      id: "6",
      email: "user6@example.com",
      password: "password6",
      name: "User Six",
      phone: "1234567895",
      type: "User",
      role: "user",
    },
    {
      id: "7",
      email: "user7@example.com",
      password: "password7",
      name: "User Seven",
      phone: "1234567896",
      type: "User",
      role: "user",
    },
    {
      id: "8",
      email: "user8@example.com",
      password: "password8",
      name: "User Eight",
      phone: "1234567897",
      type: "User",
      role: "user",
    },
    {
      id: "9",
      email: "user9@example.com",
      password: "password9",
      name: "User Nine",
      phone: "1234567898",
      type: "User",
      role: "user",
    },
    {
      id: "10",
      email: "user10@example.com",
      password: "password10",
      name: "User Ten",
      phone: "0234567899",
      type: "User",
      role: "user",
    },
  ];

  const userIds = [];

  function seedUsers() {
    users.map(async (user) => {
      const { name, email, password, phone, type, role } = user;

      try {
        const newUser = await prisma.user.create({
          data: { name, email, password, phone, type, role },
        });
        console.log("successful user seeding");
        userIds.push(newUser.id);
      } catch (error) {
        console.log(error);
      }
    });
  }

  function seedProfessionals() {
    const professionals = [];

    for (let i = 0; i < 10; i++) {
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
  }

  function seedInstitutions() {
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
        services: [
          faker.lorem.words(),
          faker.lorem.words(),
          faker.lorem.words(),
        ],
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
  }

  
    await seedUsers();
    await seedProfessionals();
    await seedInstitutions();

    res.send("All data seeded");
  
})

module.exports = router;