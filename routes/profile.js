//location/bio/experiences/education/etc.
const express = require("express");
const router = express.Router();

//tests profile route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

module.exports = router;
