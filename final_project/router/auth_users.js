const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let valid = users.filter(user=>user.username==username);
  if (valid.length()>0){
    return true
  } else {
    return false
  }
}

const authenticatedUser = (username,password)=>{ 
  if (username && password){
    let valid = users.filter(user=>user.username==username && user.password==password);
    if (valid.length>0){
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write y
  let username = req.query.username
  let password = req.query.password
  if (username && password){
    if (authenticatedUser(username, password)){
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
      return res.status(202).json({meassage: "Succesfully Logged in"})
    } else {
    return res.status(404).json({meassage: "No such user"})}
  } else{
  return res.status(404).json({message: "Invalid input"});}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn
  let review = req.query.review
  let user = req.session.authorization.username

  // let reviews = [books[isbn].reviews]
  // let exists = reviews.filter(review=>review.user==user)
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    const reviews = book.reviews;

    // Check if the user has already reviewed the book
    if (reviews.hasOwnProperty(user)) {
      // Update the existing review
      reviews[user] = review;
    } else {
      // Add a new review
      reviews[user] = review;
    }

    return res.json(books);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn
  let user = req.session.authorization.username

  // let reviews = [books[isbn].reviews]
  // let exists = reviews.filter(review=>review.user==user)
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    const reviews = book.reviews;

    // Check if the user has already reviewed the book
    if (reviews.hasOwnProperty(user)) {
      // Update the existing review
      delete reviews[user];
      return res.json(books)
    } else {

      return res.status(404).json({ message: "u have no reviews there" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
