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

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);

router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);

router.put(
  "/:id/change-password",
  authMiddleware,
  changePassword
);

router.delete(
  "/:id",
  authMiddleware,
  deleteUser
);

module.exports = router;
