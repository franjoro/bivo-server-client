const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const middlewares = require("./middlewares");
const app = express();
const bodyParser = require('body-parser')

app.use(morgan("dev"));

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
  })
);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.get("/", (req, res) => {
  res.json({
    message: "Hello World!"
  });
});
// app.use(middlewares.notFound);
// app.use(middlewares.errorHandler);








app.get("/success", (req, res) =>
  res.send("Welcome " + req.username + "!!")
);
app.get("/error", (req, res) => res.send("error logging in"));

const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(user, cb) {
  cb(null, user);
});

const { db } = require("./util/db.js");

/* PASSPORT LOCAL AUTHENTICATION */

const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy( {
  usernameField: 'username',
  passwordField: 'password'
},function(username, password, done) {
    db.collection("user")
      .where("username", "==", username)
      .where("password", "==", password)
      .get()
      .then(user => { 
        console.log(user)
          return done(null, user); 
      });


  })
);



app.post('/login',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success?username='+req.user.username);
  });

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
