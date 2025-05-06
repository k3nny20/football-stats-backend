const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://football-stats-frontend-ofqhtkb7d-kennys-projects-c2892c47.vercel.app'],
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/group'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/profile', require('./routes/profile'));

module.exports = app;
