const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

//allow localhost and deployed frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://football-stats-frontend-ofqhtkb7d-kennys-projects-c2892c47.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman) or listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/group'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/profile', require('./routes/profile'));

module.exports = app;
