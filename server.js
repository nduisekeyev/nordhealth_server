"use strict";

const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const atob = require("atob");

app.use(cors()); // Use CORS middleware to handle cross-origin requests
app.use(bodyParser.json()); // Parse JSON requests

const users = [
  {
    id: 1,
    email: "nord@user.com",
    username: "Nord User",
    password: "Tm9yZFVzZXI3Nzch!", // NordUser777!
    role: "user",
    // jwt token
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5vcmQgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.YD5e-xPmpFWfdxg9bnMom3y2dwko0fqvbdtzFNQaXyA",
    is_active: true,
    is_updates_on: false,
  },
  {
    id: 2,
    email: "nord@admin.com",
    username: "Nord Admin",
    password: "Tm9yZEFkbWluNzc3IQ==", // NordAdmin777!
    // jwt token
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5vcmQgQWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.yswrw6XMf9qiWjnZT3A6YnJIF0vWQdBULI9NME3a1fM",
    role: "admin",
    is_active: true,
    is_updates_on: false,
  },
];

app.post("/api/login", (req, res) => {
  const { email, password, updates } = req.body;

  console.log("Login Request:", req.body);

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  // Find user by email
  const user = users.find((u) => u.email === email);

  // Decode base64 encoded password
  const decodedPassword = atob(user.password);

  // Check if decoded password matches the provided password
  if (decodedPassword !== atob(password) || email !== user.email) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  // If email and password match, create a user object without the password field
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  // Include the is_updates_on property based on the updates value
  if (updates) userWithoutPassword.is_updates_on = updates;

  // If email and password match, send user details
  res.status(200).json(userWithoutPassword);
});

app.post("/api/logout", (req, res) => {
  // Check if the request has an Authorization header
  const authorizationHeader = req.headers["authorization"];

  // Check if the Authorization header starts with "Bearer "
  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    res.status(200).json({ message: "Logged out successfully." });
  } else {
    // If no or invalid token is provided, respond with an error
    res.status(401).json({ error: "Invalid or missing Bearer token." });
  }
});

app.listen(8000, () => {
  console.log("Listening on localhost:8000");
});
