const db = require('../config/db');

const Profile = {
  create: (user_id, preferred_position, preferred_foot, callback) => {
    db.query(
      'INSERT INTO profiles (user_id, preferred_position, preferred_foot) VALUES (?, ?, ?)',
      [user_id, preferred_position, preferred_foot],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.insertId);
      }
    );
  },

  getByUserId: (user_id, callback) => {
    db.query('SELECT * FROM profiles WHERE user_id = ?', [user_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }
};

module.exports = Profile;
