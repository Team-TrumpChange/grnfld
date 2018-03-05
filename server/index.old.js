//HAS GITHUB AUTH INFORMATION. NOT CURRENTLY USED

const express = require('express');
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config.js');
const bcrypt = require('bcrypt-nodejs');
const db = require('../database-pg/index');
const jwt = require('jwt-simple');

const app = express();
app.use(express.static(__dirname + '/../app'));
app.use(express.static(__dirname + '/../node_modules'));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(session({
  secret: 'keyboard dog',
  cookie: {
    maxAge: 600000,
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'html');

//require github users (github user model)
//var Github_User = require('./app/mode')
// var items = require('../database-pg');

passport.serializeUser(function (user, done) {
  console.log('serialize user', user);
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new GithubStrategy({
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: "http://localhost:3000/auth/github/callback"
},
  function (accessToken, refreshToken, profile, callback) {
    console.log('access Token', accessToken);
    console.log('refresh Token', refreshToken);
    console.log('profile', profile);
    callback(null, profile);
  }
));

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function (req, res) {
    const payload = req.user;
    const secret = config.clientSecret;
    const token = jwt.encode(payload, secret);
    // req.session.loggedin = true;
    res.redirect(`/`);
  }
);

app.get('/posts', (req, res) => {
  db.getAllPosts(data => res.json(data));
});

app.get('/test', (req, res) => {
  // wrap this in a promise/async/await
  let postsWithComments = async () => {
    res.json(await db.getPostsWithCommentsAsync());

  };

  postsWithComments();

  // res.json(db.getPostsWithCommentsAsync());  //doesn't work
});

// app.get('/comments/:postid', (req, res) => {
//   db.getComments()
// });

app.post('/createPost', (req, res) => {
  console.log('new post: ', req.body);
  // db.createPost(req.body, (data) => {
  //   console.log(data);
  //   res.end();
  // });
  res.end();
});

app.post('/login', async (req, res) => {
  const userInfo = await db.checkCredentials(req.body.username);

  if (userInfo.length) {
    const user = userInfo[0]
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.loggedIn = true;
      res.status(200).json({
        user_id: user.user_id,
        username: user.username
      });
    } else {
      res.status(401).send('false password');
    }
  } else {
    res.status(401).send('username doesn\'t exist');
  }
  
});

app.post('/register', async (req, res) => {
  const shasum = bcrypt.hashSync(req.body.password);
  const data = await db.createUser(req.body.username, shasum);
  if (data === 'already exists') {
    res.status(409).end();
  } else {
    res.status(200).end();
  }

});

app.get('*', (req, res) => { res.redirect('/') });

app.listen(process.env.PORT || 3000, function () {
  console.log('listening on port 3000!');
});
