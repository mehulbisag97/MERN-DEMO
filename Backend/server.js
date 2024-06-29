const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(bodyParser.json());
app.use(cors());

// User model
const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  dob: Date,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Endpoint to register a new user
app.post("/register", async (req, res) => {
  try {
    const { name, mobile, dob, password } = req.body;
    const newUser = new User({ name, mobile, dob, password });
    await newUser.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error registering user", error });
  }
});

// Endpoint to authenticate and generate JWT token for login
app.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile, password });

    if (user) {
      const token = jwt.sign({ mobile: user.mobile }, SECRET_KEY, {
        expiresIn: "1h",
      });
      res.status(200).send({ token, message: "Login successfully" });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error });
  }
});

// Endpoint to verify JWT token
app.post("/verify", (req, res) => {
  const { token } = req.body;
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Invalid token" });
    } else {
      res.status(200).send({ message: "Token is valid" });
    }
  });
});

app.post("/logout", (req, res) => {
  // Add logic to handle logout if needed (e.g., invalidating the token)
  res.status(200).send({ message: "Logout successful" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
