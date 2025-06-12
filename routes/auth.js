const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

// POST /api/auth/register
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("E-Mail address already exists!");
        }
        return true;
      })
      .normalizeEmail(),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long."),
    body("username")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Username is required."),
  ],
  authController.register
);

// POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;
