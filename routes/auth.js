const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const User = require('../models/User');
const router = express.Router();

// Session setup
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Passport setup
router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {
  User.findByUsername(username, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });

    const bcrypt = require('bcryptjs');
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return done(err);
      if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
      return done(null, user);
    });
  });
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Routes
router.post('/login', passport.authenticate('local'), (req, res) => {
  const user = req.user;
  res.send({ id: user.id, username: user.username });
});

router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  console.log('📥 Signup attempt:', { username, email }); // Log input (don't log password)

  if (!username || !email || !password) {
    return res.status(400).send('❌ Missing required fields');
  }

  User.create({ username, email, password }, (err, userId) => {
    if (err) {
      console.error('❌ Error creating user:', err); // Log full error
      return res.status(500).send('❌ Error creating user');
    }

    console.log('✅ User created with ID:', userId);
    res.send('✅ User created');
  });
});


router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send('Error logging out');
    res.send('✅ Logged out');
  });
});

module.exports = router;
