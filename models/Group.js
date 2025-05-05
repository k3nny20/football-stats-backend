const db = require('../config/db');
const crypto = require('crypto');

const Group = {
  create: (name, description, callback) => {
    const invite_code = crypto.randomBytes(3).toString('hex'); // generates a 6-char code

    db.query(
      'INSERT INTO `groups` (name, description, invite_code) VALUES (?, ?, ?)',
      [name, description, invite_code],
      (err, result) => {
        if (err) return callback(err);
        callback(null, { group_id: result.insertId, invite_code });
      }
    );
  },

  findByCode: (code, callback) => {
    db.query('SELECT * FROM `groups` WHERE invite_code = ?', [code], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  addUserToGroup: (user_id, group_id, callback) => {
    db.query(
      'INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)',
      [user_id, group_id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.insertId);
      }
    );
  },

  getUserGroups: (user_id, callback) => {
    db.query(
      `SELECT g.id, g.name, g.description, g.invite_code
       FROM user_groups ug
       JOIN \`groups\` g ON ug.group_id = g.id
       WHERE ug.user_id = ?`,
      [user_id],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  },
  
  getGroupsForUser: (userId, callback) => {
    const query = `
      SELECT g.id, g.name, g.description
      FROM \`groups\` g
      JOIN user_groups ug ON g.id = ug.group_id
      WHERE ug.user_id = ?
    `;
    db.query(query, [userId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
  
};

module.exports = Group;
