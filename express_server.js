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

//databases for url and users
let urlDatabase = {
  "b2xVn2": {
    userID: "userRandomID",
    longURL: "http://www.lighthouselabs.ca"
  },
  "9sm5xK": {
    userID: "user2RandomID",
    longURL: "http://www.google.com"
  }
};

let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

//http get methods
app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]){
    //redirect to the login page
    res.redirect(301, "/login");
  } else {
    let templateVars = {
      urls: urlDatabase,
      user: users[req.cookies["user_id"]]
    };

    console.log(req.cookies["user_id"]);
    res.render("urls_new", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = "";

  //search for the url in urlDadatabase
  for (let url in urlDatabase){
    if (req.params.shortURL === url){
      longURL = urlDatabase[url].longURL;
    }
  }

  //redirect to the long URL
  res.redirect(301, longURL);
});

app.get("/urls/:id", (req, res) => {
  //saving the required variables
  // => fix shortURL, all respective shortURLs?
  let usersShortURL;
  for (let url in urlDatabase){
    for (let shortURL in Object.keys(urlDatabase)){
      if(url == Object.keys(urlDatabase)[shortURL]){
        usersShortURL = url;
      }
    }
  }

  let templateVars = {
    shortURL: usersShortURL,
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };

  //redirect to the short url details
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  //saving the required variables
  let templateVars = {
    urls: urlsForUser(req.cookies["user_id"]),
    user: users[req.cookies["user_id"]]
  };

  //redirect to the url overview list
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  //redirect to the url overview list
  res.render("urls_email");
});

app.get("/login", (req, res) => {
  //saving the required variables
  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };

  //redirect to the url overview list
  res.render("urls_login", templateVars);
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
  //add a new url to the database
  let shortURL = generateRandomString();

  let url = {
    id: req.cookies["user_id"],
    longURL: req.body.longURL
  }

  urlDatabase[shortURL] = url;

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

  //update the url to the url database
  urlDatabase[req.params.id].longURL = req.body.longURL;

  //redirect to url overview list
  res.redirect(301, '/urls');
});

app.post("/login", (req, res) => {
  if (!req.body.email){
    //no email provided
    res.status(400).send('E-mail has not been provided!');
  } else if(!req.body.password){
    //no password provided
    res.status(400).send('Password has not been provided!');
  } else {
    //loop through users
    for (let user in users){
      //does the user exist in users
      if (req.body.email === users[user].email)
      {
        //is the password correct
        if (req.body.password === users[user].password){
          //save the id in the cookie
          res.cookie('user_id', users[user].id);
          //redirect to the welcome page
          res.redirect(301, '/urls/new');
        } else{
          res.status(403).send("The password does not match!");
        }
      }
    }
    //reaching this point means the e-mail has not been registered
    res.status(403).send(`E-mail ${req.body.email} has not been registered!`);
  }
});

app.post("/logout", (req, res) => {
  //delete the cookie user_id
  res.clearCookie('user_id');

  //redirect to the url overview list
  res.redirect(301, '/urls');
});

app.post("/register", (req, res) => {
  //handle errors
  if (!req.body.email){
    //redirect to the url overview list
    res.status(400).send('E-mail has not been provided!');
  } else if(!req.body.password){
    res.status(400).send('Password has not been provided!');
  } else {
    for (let email in users){
      if (req.body.email === users[email].email)
      {
        res.status(400).send(`E-mail ${req.body.email} has already been registered!`);
      }
    }
    //create the cookie user_id and save the provided user
    let userID = generateRandomString();
    let user = {
      id: userID,
      email: req.body.email,
      password: req.body.password}

    users[userID] = user;
    res.cookie('user_id', userID);
    //redirect to the url overview list
    res.redirect(301, '/urls');
  }
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

function urlsForUser(id) {
  let usersURLs = {};

  //show only the urls that belong to a user_id
  for (let urls in urlDatabase){
    if (id === urlDatabase[urls].userID){
      usersURLs[urls] = urlDatabase[urls];
    }
  }
  return usersURLs;
}
