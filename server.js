const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const User = require('./models/user.js');
const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.get('/users', async(req, res) => {
  const users = await User.find()//get all user from the data base 
  res.render('users/index.ejs', {users: users})
})

app.get('/users/show/:id', async(req,res) => {
  try {
    const user = await User.findById(req.params.id); // Fetch the user by ID
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('users/show.ejs', { user: user }); // Pass the user to the view
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});

app.use(passUserToView)
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/foods',foodsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});