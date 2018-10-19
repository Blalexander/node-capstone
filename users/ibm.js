var PersonalityInsightsV3 = require("watson-developer-cloud/personality-insights/v3");
const axios = require("axios");
const express = require("express");

const router = express.Router();

var personalityInsights = new PersonalityInsightsV3({
  version: "2017-10-13",
  username: "3875d789-6bf8-4948-b405-9022307771ac",
  password: "CqfupSRcWoYC",
  url: "https://gateway.watsonplatform.net/personality-insights/api"
});

var profileParams = {
  // Get the content from the JSON file.
  content: require("./profile.json"),
  content_type: "application/json",
  consumption_preferences: true,
  raw_scores: true
};

personalityInsights.profile(profileParams, function(error, profile) {
  if (error) {
    console.log(error);
  } else {
    console.log(JSON.stringify(profile, null, 2));
  }
});
