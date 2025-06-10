const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(
  () => {
    console.log("Connected to MongoDB");
  },
  (err) => {
    console.error("Failed to connect to MongoDB", err);
  }
);

// Imort routes
const postRoutes = require("./routes/posts");
app.use("/api/posts", postRoutes);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});