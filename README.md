# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten URLs (á la bit.ly).

## Final Product
!["URL overview"](https://github.com/michaelrychly/tinyUrl/blob/master/docs/OverviewURL.png?raw=true)
!["URL add"](https://github.com/michaelrychly/tinyUrl/blob/master/docs/AddURL.png?raw=true)
!["URL update"](https://github.com/michaelrychly/tinyUrl/blob/master/docs/UpdateURL.png?raw=true)

## Dependencies

- Node.js
- Express
- Ejs
- bcrypt
- body-parser
- cookie-session

## Getting started

- install all dependencies (using `npm install` command).
- Run the development web server using the `node express_server.js` command - `npm run devstart` or `npm run start`.
- run the development web server using `node express_server.js` or `npm run start`.
- start by registering as a new user: http://localhost:8080/register

## Room for improvement

- Chrome will cache redirects and this will sometimes lead to situations where the user can't go to the login page. In this case navigate to 'More Tools' -> 'Clear browsing data' and delete the last hour. 
