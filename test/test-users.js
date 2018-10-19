"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const { User } = require("../users");

const expect = chai.expect;
chai.use(chaiHttp);

describe("/api/user", function() {
  const email = "exampleEmail";
  const password = "examplePass";
  const emailB = "exampleEmailB";
  const passwordB = "examplePassB";

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {});

  afterEach(function() {
    return User.remove({});
  });

  describe("/api/users", function() {
    describe("POST", function() {
      it("Should reject users with missing email", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            password
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Missing field");
            expect(res.body.location).to.equal("email");
          });
      });
      it("Should reject users with missing password", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Missing field");
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with non-string email", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email: 1234,
            password
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Incorrect field type: expected string"
            );
            expect(res.body.location).to.equal("email");
          });
      });
      it("Should reject users with non-string password", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password: 1234
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Incorrect field type: expected string"
            );
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with non-trimmed email", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email: ` ${email} `,
            password
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Cannot start or end with whitespace"
            );
            expect(res.body.location).to.equal("email");
          });
      });
      it("Should reject users with non-trimmed password", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password: ` ${password} `
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Cannot start or end with whitespace"
            );
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with empty email", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email: "",
            password
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Must be at least 4 characters long"
            );
            expect(res.body.location).to.equal("email");
          });
      });
      it("Should reject users with password less than ten characters", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password: "123456789"
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Must be at least 10 characters long"
            );
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with password greater than 72 characters", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password: new Array(73).fill("a").join("")
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Must be at most 72 characters long"
            );
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with duplicate email", function() {
        // Create an initial user
        return User.create({
          email,
          password
        })
          .then(() =>
            // Try to create a second user with the same username
            chai
              .request(app)
              .post("/api/users")
              .send({
                email,
                password
              })
          )
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Email already taken");
            expect(res.body.location).to.equal("Email");
          });
      });
      it("Should create a new user", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            username,
            password
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.keys("email");
            expect(res.body.email).to.equal(email);

            return User.findOne({
              email
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
    });

    describe("GET", function() {
      it("Should return an empty array initially", function() {
        return chai
          .request(app)
          .get("/api/users")
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.length(0);
          });
      });
      it("Should return an array of users", function() {
        return User.create(
          {
            email,
            password
          },
          {
            email: emailB,
            password: passwordB
          }
        )
          .then(() => chai.request(app).get("/api/users"))
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.deep.equal({
              email
            });
            expect(res.body[1]).to.deep.equal({
              email: emailB
            });
          });
      });
    });
  });
});
