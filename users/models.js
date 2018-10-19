"use strict";
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  cardlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "cardlist" }]
});

// UserSchema.pre("findOne", function(next) {
//   this.populate("cardlists");
//   next();
// });

// UserSchema.pre("find", function(next) {
//   this.populate("cardlists");
//   next();
// });

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    email: this.email,
    cardlists: this.cardlists
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model("User", UserSchema);

module.exports = { User };
