const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const authenticate = require("../middleware/auth.middleware");
const userLogController = require("../controller/userLog.controller");

router.post("/login", userController.login);
router.get("/me", authenticate, userController.getme);
router.post("/logout", authenticate, userLogController.logout);
router.get("/getlogs", authenticate, userLogController.getLogs);
router.get("/getusers", authenticate, userController.getUsers);
router.post("/adduser", authenticate, userController.adduser);
router.patch("/edituser/:id", authenticate, userController.edituser);
router.put("/updateProfile/:id", authenticate, userController.profileupdate);
router.delete("/deleteuser/:id", authenticate, userController.deleteUser);
router.post("/authenticate/me", authenticate, userController.auth);
router.get("/pass", authenticate, userController.getpass);
router.post("/presence/ping", authenticate, userController.presence);

module.exports = router;
