const express = require("express");

const {
  getUsers,
  getUserById,
  createUser,
  login,
  updateUser,
  changePassword,
  deleteUser,
} = require("../controllers/userController");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const router = express.Router();

// Public
router.post("/register", createUser);
router.post("/login", login);

// Protected
router.get("/", authentication, authorize("admin"), getUsers);
router.get("/:id", authentication, authorize("admin"), getUserById);
router.put("/:id", authentication, updateUser);
router.put("/:id/change-password", authentication, changePassword);
router.delete("/:id", authentication, deleteUser);

module.exports = router;
