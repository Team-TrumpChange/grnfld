const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const db = require('../database-pg/index');
const AYLIENTextAPI = require('aylien_textapi');
const foaas = require('./foaas.js');
const session = require('express-session');

let aylienId;
let aylienKey;

if (!process.env.AYLIEN_ID) {
  const config = require('../database-pg/config.js');
  aylienId = config.aylien.id;
  aylienKey = config.aylien.key;
} else {
  aylienId = process.env.AYLIEN_ID;
  aylienKey = process.env.AYLIEN_KEY;
}

let getSentiment = new AYLIENTextAPI({
  application_id: aylienId,
  application_key: aylienKey
});

const app = express();

app.use(express.static(__dirname + '/../app'));
app.use(express.static(__dirname + '/../node_modules'));

app.use(bodyParser.json());

app.use(session({
  secret: 'the mystery machine',
  cookie: {
    maxAge: 60000000,
  }
}));

const timer =  24 * 60 * 1000; //hours minutes seconds  //15 * 1000
let refreshCoins = setInterval( () => {
  db.refreshCoins();
}, timer);


app.get('/posts', async (req, res) => {
  let posts = await db.getAllPosts();
  res.json(posts);
});

app.get('/userPosts', async (req, res) => {
  let userId = req.query.userId;
  let posts = await db.getUserPosts(userId)
  res.json(posts);
});

app.get('/user', async (req,res) => {
  let userId = req.query.userid;
  if (!userId) {
    res.redirect('/');
  } else {
    let user = await db.getUser(userId);
    res.json(user);
  }
});

app.patch('/user', async (req, res) => {
  let userId = req.body.userid;
  let skills = req.body.skills;
  await db.updateUserSkills(userId, skills);
  res.end();
});

app.patch('/closePost', async (req, res) => {
  console.log(req.body)
  let postId = req.body.postId;
  console.log(postId, 'postId')
  await db.closePost(postId);
  res.end();
})

// app.get('/test', (req, res) => {
  // wrap this in a promise/async/await
  // let postsWithComments = async () => {
    // res.json(await db.getPostsWithCommentsAsync());

  // };

  // postsWithComments();

  // res.json(db.getPostsWithCommentsAsync());  //doesn't work
// });

app.get('/comments', async (req, res) => {
  let postId = req.query.postId;
  let comments = await db.getComments(postId);
  res.json(comments);
});

app.get('/subcomments', async (req, res) => {
  console.log('req.query:', req.query);
  let subcomments = await db.getSubcomments(req.query.commentId);
  console.log('subcomments in get:', subcomments);
  res.json(subcomments);
})

app.get('/userComments', async (req, res) => {
  let userId = req.query.userId;
  let comments = await db.getUserComments(userId);
  res.json(comments);
});

app.get('/userNotes', async (req, res) => {
  console.log('req.query:', req.query);
  let notes = await db.getUserNotes(req.query);
  res.json(notes);
});

app.post('/createPost', async (req, res) => {
  try {
    let currentHackCoins = await db.checkQuestCoin(req.body.userId);
    currentHackCoins = currentHackCoins.pop().questcoin;

    if (currentHackCoins > 0 && req.body.questcoin <= currentHackCoins) { //user has usable coins and asking to use a number of some available -- good update db
      await db.minusQuestCoin(req.body)
      await db.createPost(req.body);
      res.status(200).end();
    } else if(currentHackCoins > 0 && req.body.questcoin > currentHackCoins) { //if usable coins but asking to use more than available
      console.log('tried to use too many hack coins');
      res.status(409).end();  //send something in the body for client
    } else if(currentHackCoins <= 0) {  //if no usable coins
      res.status(409).end();  //send something in the body for client
    } else {
      console.log('unexpected edge case', 'currentHackCoins', currentHackCoins,  req.body);
    }

  } catch (err) {
    console.log(err);
  }
  res.end();
});

app.post('/createComment', (req, res) => {
  let comment = req.body;
  getSentiment.sentiment({text: comment.message}, async (err, sentiment) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      if (sentiment.polarity === 'negative' && sentiment.polarity_confidence > 0.75) {
        foaas(comment.message, comment.user_id, function(err, warning) {
          if (err) {
            res.status(500).end();
          } else {
            res.json({rejection: warning})
          }
        });
      } else {
        try {
          await db.createComment(comment);
          await db.addQuestCoin(comment)
        } catch (err) {
          res.status(500).end();
        }
        res.end();
      }
    }
  });
});

app.post('/createSubcomment', async (req, res) => {
  console.log('req.body:', req.body);
  try {
    await db.createSubcomment(req.body);
  } catch (err) {
    console.log('err:', err);
  }
  res.end();
});

app.post('/createNote', async (req, res) => {
  console.log('req.body', req.body);
  try {
    await db.createNote(req.body);
  } catch(err) {
    console.log('err:', err);
  }
  res.end();
});

app.post('/login', async (req, res) => {
  const userInfo = await db.checkCredentials(req.body.username);

  if (userInfo.length) {
    const user = userInfo[0];
    if (bcrypt.compareSync(req.body.password, user.password)) {

      req.session.loggedIn = true;
      req.session.user_id = user.user_id;

      res.status(200).json({
        user_id: user.user_id,
        username: user.username,
        hackcoin: user.hackcoin,
        questcoin: user.questcoin
      });
    } else {
      res.status(401).send('false password');
    }
  } else {
    res.status(401).send('username does not exist');
  }
});




app.post('/autoLogin', async (req,res) => {
  if (req.session.loggedIn === true) {
    let user = await db.getUser(req.session.user_id)
    res.json(user);
  } else {
    res.end();
  }
})


app.post('/register', async (req, res) => {
  const shasum = bcrypt.hashSync(req.body.password);

  const avatar = `https://api.adorable.io/avatars/80/${req.body.username}.png`
  const data = await db.createUser(req.body.username, shasum, req.body.email, req.body.skills);
  if (data === 'username already exists') {
    res.status(409).send('username already exists');    
  } else if (data === 'email already exists') {
    res.status(409).send('email already exists');
  } else {
    const userInfo = await db.checkCredentials(req.body.username);
    req.session.loggedIn = true;
    req.session.user = userInfo[0];
    res.status(200).json({
      user_id: userInfo[0].user_id,
      username: userInfo[0].username,
      hackcoin: userInfo[0].hackcoin,
      questcoin: userInfo[0].questcoin
    });
  }
});

app.post('/logout', (req, res) => {
  console.log('logging out');
  req.session.destroy();
})

app.post('/coin', async (req, res) => {
  let currentHackCoins = await db.checkQuestCoin(req.body.userId);
  currentHackCoins = currentHackCoins.pop().questcoin;

  if (currentHackCoins > 0 && req.body.questcoin <= currentHackCoins) { //user has usable coins and asking to use a number of some available -- good update db
    await db.subtractCoins(currentHackCoins, req.body.questcoin, req.body.userId, req.body.commentId);
    res.status(200).end();
  } else if(currentHackCoins > 0 && req.body.questcoin > currentHackCoins) { //if usable coins but asking to use more than available
    console.log('tried to use too many hack coins');
    res.status(409).end();  //send something in the body for client
  } else if(currentHackCoins <= 0) {  //if no usable coins
    res.status(409).end();  //send something in the body for client
  } else {
    console.log('unexpected edge case', 'currentHackCoins', currentHackCoins,  req.body);
  }
});

app.post('/solution', async (req, res) => {
  console.log('req.body:', req.body);
  if (req.body.select) {
    const data = await db.markSolution(req.body.commentId, req.body.postId);
  } else {
    const data = await db.unMarkSolution(req.body.commentId);
  }
  res.status(200).end();
});

app.get('*', (req, res) => {
  console.log('OPEN');
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('listening on port 3000!');
});

