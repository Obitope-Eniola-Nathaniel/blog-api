const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();



const app = express();
app.use(express.json());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(
  () => {
    console.log("Connected to MongoDB");
  },
  (err) => {
    console.error("Failed to connect to MongoDB", err);
  }
);

app.use(bodyParser.json());

// Imort routes
const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");
const isAuth = require("./middleware/is-auth");

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
// GET /auth-endpoint localhost:3000/auth-endpoint
app.get("/auth-endpoint", isAuth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

