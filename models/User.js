const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  findByUsername: (username, callback) => {
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  create: (userData, callback) => {
    bcrypt.hash(userData.password, 10, (err, hash) => {
      if (err) return callback(err);
      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [userData.username, userData.email, hash],
        (err, result) => {
          if (err) return callback(err);
          callback(null, result.insertId);
        }
      );
    });
  }
};

module.exports = User;
