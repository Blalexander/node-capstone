"use strict";
require("dotenv").config();

//Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const morgan = require("morgan");

//Routes
const { router: usersRouter } = require("./users");
const { router: authRouter, localStrategy, jwtStrategy } = require("./auth");
// const ibmRouter = require("./users/ibm");
const jwtAuth = passport.authenticate("jwt", { session: false });
const { PORT, DATABASE_URL, TEST_DATABASE_URL } = require("./config");
const app = express();

//Middleware
app.use(morgan("common"));
passport.use(localStrategy);
passport.use(jwtStrategy);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use(express.json());
app.use(express.static("public"));
// app.use("/ibm", ibmRouter);
mongoose.Promise = global.Promise;

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  if (req.method === "OPTIONS") {
    return res.send(204);
  }
  next();
});

//Test Protected endpoint
app.get("/api/protected", jwtAuth, (req, res) => {
  return res.json({
    data: "Snoopy"
  });
});

let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      require.main === module ? DATABASE_URL : TEST_DATABASE_URL,
      { useNewUrlParser: true },
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(PORT, () => {
            console.log(`Your app is listening on port ${PORT}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
