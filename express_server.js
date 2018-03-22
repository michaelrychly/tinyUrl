"use strict";
//parameters
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');

var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

//connecting to express
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['user_id']
}))

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
  if (req.session.user_id === ""){
    //redirect to the login page
    res.redirect(301, "/login");
  } else {
    res.redirect(301, "/urls");
  }
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id){
    //redirect to the login page
    res.redirect(301, "/login");
  } else {
    let templateVars = {
      urls: urlDatabase,
      user: users[req.session.user_id]
    };

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

  //check if the longURL could be found
  if (longURL !== ""){
    //redirect to the long URL
    res.redirect(301, longURL);
  } else{
    res.end("<html><body>The shortURL does not exist.</body></html>\n");
  }
});

app.get("/urls/:id", (req, res) => {
  //saving the required variables
  let templateVars = {
    shortURL: req.params.id,
    urls: urlDatabase,
    user: users[req.session.user_id]
  };

  //redirect to the short url details
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  //saving the required variables
  let templateVars = {
    urls: urlsForUser(req.session.user_id),
    user: users[req.session.user_id]
  };

  //redirect to the url overview list
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  //redirect to the url overview list
  res.render("urls_email");
});

app.get("/login", (req, res) => {
  console.log(req.session.user_id);
  if (!req.session.user_id){
    //saving the required variables
    let templateVars = {
      urls: urlDatabase,
      user: users[req.session.user_id]
    };

    //redirect to the url overview list
    res.render("urls_login", templateVars);
  } else {
  //redirect to the urls page
    res.redirect(301, "/urls");
  }
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
  if (!req.session.user_id){
    res.end("<html><body>You are not logged in. You are not allowed to update data. </body></html>\n");
  } else {
    //add a new url to the database
    let shortURL = generateRandomString();
    let url = {
      userID: req.session.user_id,
      longURL: req.body.longURL
    }

    urlDatabase[shortURL] = url;
    //redirect to the urls overview
    res.redirect(301, '/urls');
  }
});

app.post("/urls/:id/delete", (req, res) => {
  if (!req.session.user_id){
    res.end("<html><body>You are not logged in. You are not allowed to delete data. </body></html>\n");
  } else {
    //delete the url from the url database
    delete urlDatabase[req.params.id];

    //redirect to the url overview list
    res.redirect(301, '/urls');
  }
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
        if (bcrypt.compareSync(req.body.password, users[user].password)){
          //save the id in the cookie
          req.session.user_id = users[user].id;
          //redirect to the welcome page
          //res.redirect(301, '/urls/new');
          return res.redirect(301, '/');
        } else{
          return res.status(403).send("The password does not match!");
        }
      }
    }
    //reaching this point means the e-mail has not been registered
    return res.status(403).send(`E-mail ${req.body.email} has not been registered!`);
  }
});

app.post("/logout", (req, res) => {
  //delete the cookie user_id
  req.session = null;

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
        return res.status(400).send(`E-mail ${req.body.email} has already been registered!`);
      }
    }
    //create the cookie user_id and save the provided user
    let userID = generateRandomString();
    let user = {
      id: userID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)}

    users[userID] = user;
    req.session.user_id = userID;
    console.log("register", users);
    console.log("userID", userID);
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
