const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!isValid(username)){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
    }else{
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let getBookList = new Promise((resolve, reject)=>{
    resolve(books)
  })
  getBookList.then((getBksList)=> res.send(JSON.stringify(getBksList, null, 4)));

});

function getByIsbn(isbn) {
    return new Promise((resolve, reject) => {
        let isbnVal = parseInt(isbn);
        if (books[isbnVal]) {
            resolve(books[isbnVal]);
        } else {
            reject({status:404, message:`ISBN ${isbn} not found`});
        }
    })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    getByIsbn(req.params.isbn)
    .then(
        (data) => res.send(data),
        (err) => res.status(err.status).json({message: err.message})
    );

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let getBookList = new Promise((resolve, reject)=>{
    resolve(books)
  })
  getBookList
  .then((bookEn) => Object.values(bookEn))
  .then((books) => books.filter((book) => book.author === author))
  .then((filterBks) => res.send(filterBks))

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let getBookList = new Promise((resolve, reject)=>{
    resolve(books)
  })
  getBookList
  .then((bookEn) => Object.values(bookEn))
  .then((books) => books.filter((book) => book.title === title))
  .then((filterBks) => res.send(filterBks))

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    res.send(book.reviews);
  }
  return res.status(404).json({message: `The Review of the book is not found!`});
});

module.exports.general = public_users;
