const db = require('../config/db');

const Stat = {
  submit: (data, callback) => {
    const {
      user_id, group_id, goals, assists, pass_rating,
      dribbling_rating, defensive_rating, positions, match_date
    } = data;

    const match_rating = (
      (parseFloat(pass_rating) + parseFloat(dribbling_rating) + parseFloat(defensive_rating)) / 3
    ).toFixed(1);

    const query = `
      INSERT INTO stats (
        user_id, group_id, goals, assists,
        pass_rating, dribbling_rating, defensive_rating,
        match_rating, positions, match_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [user_id, group_id, goals, assists, pass_rating, dribbling_rating, defensive_rating, match_rating, positions, match_date],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.insertId);
      }
    );
  },

  getByGroup: (group_id, callback) => {
    db.query(
      `SELECT s.*, u.username FROM stats s
       JOIN users u ON s.user_id = u.id
       WHERE s.group_id = ?
       ORDER BY s.match_date DESC`,
      [group_id],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  },

  getByUserId: (user_id, callback) => {
    db.query(
      `SELECT * FROM stats WHERE user_id = ? ORDER BY match_date DESC`,
      [user_id],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  }
};

module.exports = Stat;
