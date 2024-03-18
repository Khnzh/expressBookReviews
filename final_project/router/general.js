const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  let username = req.query.username
  let pwd = req.query.password
  console.log(username)
  console.log(pwd)


  if (username && pwd) {
    if (!doesExist(username)){
      users.push({"username":username,"password":pwd});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } else{
    return res.status(404).json({message: "Unable to register user!"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbnNum = req.params.isbn
  let book = books[isbnNum]
  return res.json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author
  let filteredBooks=[]
  
  Object.entries(books).forEach(([isbn, book]) => {
    if (book.author.includes(author)) {
      filteredBooks.push(book);
    }
  });

  return res.json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title
  let filteredBooks=[]
  
  Object.entries(books).forEach(([isbn, book]) => {
    if (book.title.includes(title)) {
      filteredBooks.push(book);
    }
  });

  return res.json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbnNum = req.params.isbn
  let book = books[isbnNum]

  let reviews = book.reviews

  return res.json(reviews);
});

module.exports.general = public_users;
