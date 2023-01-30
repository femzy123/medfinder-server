const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
chai.use(chaiHttp);

describe("/professional", () => {
  it("it should create a new professional", (done) => {
    const professional = {
      userId: 1,
      address: "123 Main St",
      country: "US",
      specialty: "Surgery",
      institution: "Hospital XYZ",
    };
    chai
      .request(server)
      .post("/1/professional")
      .send(professional)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have
          .property("message")
          .eql("Professional created successfully");
        done();
      });
  });
});