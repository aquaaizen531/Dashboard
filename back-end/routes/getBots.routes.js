const express = require("express");
const router = express.Router();
const botcontroller = require("../controller/bot.controller");
const authenticate = require("../middleware/auth.middleware");

router.get("/getbots", authenticate, botcontroller.getbots);
router.get("/verify", authenticate, (req, res) => {
  res.status(200).json({ message: "User verified", user: req.user });
});
router.get("/get-bot-analysis", authenticate, botcontroller.getBotAnalysis)

module.exports = router;
