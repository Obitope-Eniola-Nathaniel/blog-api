const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post(
  "/register",
  [
    // Validate email
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          return Promise.reject("E-Mail address already exists!");
        }
        return true;
      })
      .normalizeEmail(),

    // Validate password
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long."),

    // Validate username
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required."),
  ],
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Log in an existing user
 */
router.post("/login", authController.login);

/**
 * @route   POST /api/auth/logot
 * @desc    Logot a new user
 */
router.post("/loout", authController.logout);

module.exports = router;
