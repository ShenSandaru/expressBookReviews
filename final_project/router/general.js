const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
  try {
      // Get username and password from request body
      const { username, password } = req.body;
      
      // Check if username and password are provided
      if (!username || !password) {
          return res.status(400).json({
              message: "Username and password are required"
          });
      }
      
      // Check if username already exists
      const userExists = users.find(user => user.username === username);
      if (userExists) {
          return res.status(409).json({
              message: "Username already exists"
          });
      }
      
      // Register new user
      users.push({ username, password });
      return res.status(201).json({
          message: "User registered successfully"
      });

  } catch (error) {
      return res.status(500).json({
          message: "Error registering user",
          error: error.message
      });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  try {
      // Convert books object to neatly formatted JSON string
      const formattedBooks = JSON.stringify(books, null, 2);
      
      // Send response with proper headers
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(formattedBooks);
  } catch (error) {
      return res.status(500).json({
          message: "Error retrieving book list",
          error: error.message
      });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
        const formattedBook = JSON.stringify(book, null, 2);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(formattedBook);
    } else {
        return res.status(404).json({
            message: "Book not found for the given ISBN"
        });
    }
    } catch (error) {
    return res.status(500).json({
        message: "Error retrieving book details",
        error: error.message
    });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    try {
        const author = req.params.author;
        const bookKeys = Object.keys(books);
        const matchingBooks = bookKeys
            .map(key => books[key])
            .filter(book => book.author.toLowerCase() === author.toLowerCase());
        
        if (matchingBooks.length > 0) {
            const formattedBooks = JSON.stringify(matchingBooks, null, 2);
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).send(formattedBooks);
        } else {
            return res.status(404).json({
                message: "No books found for the given author"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by author",
            error: error.message
        });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
  try {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const matchingBooks = bookKeys
        .map(key => books[key])
        .filter(book => book.title.toLowerCase() === title.toLowerCase());

    if (matchingBooks.length > 0) {
        const formattedBooks = JSON.stringify(matchingBooks, null, 2);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(formattedBooks);
    } else {
        return res.status(404).json({
            message: "No books found for the given title"
        });
    }
} catch (error) {
    return res.status(500).json({
        message: "Error retrieving books by title",
        error: error.message
    });
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
      const formattedReviews = JSON.stringify(book.reviews, null, 2);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(formattedReviews);
    } else {
      return res.status(404).json({
        message: "Book not found for the given ISBN"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving book reviews",
      error: error.message
    });
    }
  
});

module.exports.general = public_users;
