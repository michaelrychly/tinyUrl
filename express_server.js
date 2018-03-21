"use strict";
//parameters
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

//connecting to express
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//http get methods
app.get("/", (req, res) => {
  res.render("Hello!");
});

app.get("/urls/new", (req, res) => {
  //saving the reuired variables
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = "";

  //search for the url in url database
  for (let url in urlDatabase){
    if (req.params.shortURL === url){
      longURL = urlDatabase[url];
    }
  }

  //redirect to the long URL
  res.redirect(301, longURL);
});

app.get("/urls/:id", (req, res) => {
  //saving the reuired variables
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase,
    username: req.cookies["username"]
  };

  //redirect to the short url details
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  //saving the reuired variables
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };

  //redirect to the url overview list
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  //return the url database as json
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  //return hello world as html string
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

//http post methods
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();

  urlDatabase[shortURL] = req.body.longURL;

  //redirect to the short url details
  res.redirect(301, '/urls/' + shortURL);
});

app.post("/urls/:id/delete", (req, res) => {
  //delete the url from the url database
  delete urlDatabase[req.params.id];

  //redirect to the url overview list
  res.redirect(301, '/urls');
});

app.post("/urls/:id", (req, res) => {
  //add the url to the url database
  urlDatabase[req.params.id] = req.body.longURL;

  //redirect to url overview list
  res.redirect(301, '/urls');
});

app.post("/urls/:id", (req, res) => {
  //update the long url for a particular short url
  urlDatabase[req.params.id] = req.body.longURL;

  //redirect to url overview list
  res.redirect(301, '/urls');
});

app.post("/login", (req, res) => {
  //create the cookie username and save the provided username
  res.cookie('username', req.body.username);

  //redirect to the url overview list
  res.redirect(301, '/urls');
});

app.post("/logout", (req, res) => {
  //delete the cookie username
  res.clearCookie('username');

  //redirect to the url overview list
  res.redirect(301, '/urls');
});

//http listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  //create a random string that has 6 alphanumeric charactars
  for (var i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}