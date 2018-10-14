const express = require("express");
const router = express.Router();

//tests post route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "Personality Works" }));

module.exports = router;
