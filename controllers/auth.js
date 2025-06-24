const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Register Controller
exports.register = async (req, res, next) => {
  const errors = validationResult(req);

  // Handle validation errors
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
      errors: errors.array(),
    });
  }

  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Return success response
    res.status(201).json({
      message: "User created successfully!",
      userId: savedUser._id,
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err); // Forward to global error handler
  }
};

// Login Controller
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check for empty fields
    if (!email || !password) {
      const error = new Error("Email and password are required.");
      error.statusCode = 400;
      throw error;
    }

    // Find user by email
    const user = await User.findOne({ email });
    const isMatch = user && await bcrypt.compare(password, user.password);

    // Check if user exists and password is correct
    if (!user || !isMatch) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      "secret", // ⚠️ Replace with environment variable in production
      { expiresIn: "1d" }
    );

    // Send cookie + response
    res
      .cookie("TOKEN", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: false, // Set to true if using HTTPS
      })
      .status(200)
      .json({ message: "Logged in successfully" });

  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};
