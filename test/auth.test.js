const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
const nock = require("nock");
chai.use(chaiHttp);

describe("Test Register Auth", () => {
  
  before(() => {
    nock("http://localhost:3000")
      .post("/api/auth/register")
      .reply(201, { response: "User created successfully", data: {} });
  });

  it("it should return an error message if any of the parameters are missing", (done) => {
    chai
      .request(server)
      .post("/api/auth/register")
      .send({
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        type: "personal",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("All fields are required");
      });
    done();
  });

  it("it should return an error message if email format is invalid", (done) => {
    chai
      .request(server)
      .post("/api/auth/register")
      .send({
        name: "John Doe",
        email: "invalidemail",
        password: "password",
        phone: "1234567890",
        type: "personal",
        role: "user",
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Invalid email format");
      });
    done();
  });

  it("it should create a new user successfully", (done) => {
    chai
      .request(server)
      .post("/api/auth/register")
      .send({
        name: "John Doe",
        email: "johndoe2@example.com",
        password: "password",
        phone: "1234667890",
        type: "personal",
        role: "user",
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have
          .property("response")
          .eql("User created successfully");
        res.body.should.have.property("data");
      });
    done();
  });
});

describe("Test Login Auth", () => {
  // should return an error message when email or password is invalid
  it("should return an error message when email or password is invalid", (done) => {
    chai
      .request(server)
      .post("/api/auth/login")
      .send({
        email: "John Doe",
        password: "password1",
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("Wrong email or password");
      });
    done();
  });

  // should return an access token
  it("should return an access token", (done) => {
    chai
      .request(server)
      .post("/api/auth/login")
      .send({
        email: "johndoe@example.com",
        password: "password",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("accessToken");
      });
    done();
  });

  // should return an user information
  it("should return an user information", (done) => {
    chai
      .request(server)
      .post("/api/auth/login")
      .send({
        email: "johndoe2@example.com",
        password: "password",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
      });
    done();
  });
});
