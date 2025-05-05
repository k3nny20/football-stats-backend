const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// ✅ Updated CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Only allow your frontend
  credentials: true               // Allow cookies / sessions
}));

app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/group'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/profile', require('./routes/profile'));

module.exports = app;
