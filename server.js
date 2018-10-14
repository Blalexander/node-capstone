const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/users");
const profile = require("./routes/profile");
const personality = require("./routes/personality");

const app = express();

//DB config
const db = require("./config").mongoURI;

//Connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello World"));

//Routes
app.use("/users", users);
app.use("/profile", profile);
app.use("/personality", personality);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port ${port}`));
