const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  // Check if username is non-empty and unique
  return username && username.length > 0 && !users.some(u => u.username === username);
};


const authenticatedUser = (username, password) => {
  // Check if credentials match
  return users.some(u => u.username === username && u.password === password);
};



//only registered users can login
regd_users.post("/login", (req, res) => {
  try {
      const { username, password } = req.body;
      if (!username || !password) {
          return res.status(400).json({ message: "Username and password are required" });
      }
      if (!authenticatedUser(username, password)) {
          return res.status(401).json({ message: "Invalid username or password" });
      }
      const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
      req.session.token = token;
      return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
      return res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
