# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten URLs (á la bit.ly).

## Final Product
!["URL overview"](https://github.com/michaelrychly/express/blob/master/docs/OverviewURL.png?raw=true)
!["URL add"](https://github.com/michaelrychly/express/blob/master/docs/AddURL.png?raw=true)
!["URL update"](https://github.com/michaelrychly/express/blob/master/docs/UpdateURL.png?raw=true)

## Dependencies

- Node.js
- Express
- Ejs
- bcrypt
- body-parser
- cookie-session

## Getting started

- install all dependencies (using `npm install` command).
<<<<<<< HEAD
- Run the development web server using the `node express_server.js` command - `npm run devstart` or `npm run start`.
=======
- run the development web server using `node express_server.js` or `npm run start`.
- start by registering as a new user: http://localhost:8080/register

## Room for improvement

- when the user does not log out and the server is restarted, all added users will be gone
- this leads to unwanted behaviour currently in which the user can't reach neither the login nor the register page
- solution is to delete the session when the user cannot be found in the user object
- this solution is currently pending
