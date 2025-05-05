const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const db = require('../config/db');

// ✅ Route: Create a new group
router.post('/create', (req, res) => {
  const { name, description, user_id } = req.body;

  Group.create(name, description || null, (err, groupData) => {
    if (err) return res.status(500).send('Error creating group');

    Group.addUserToGroup(user_id, groupData.group_id, (err2) => {
      if (err2) return res.status(500).send('Error linking user to group');
      res.send({ message: '✅ Group created', group_id: groupData.group_id });
    });
  });
});

// ✅ Route: Join a group using group_id
router.post('/join', (req, res) => {
  const { user_id, group_id } = req.body;

  const query = 'INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)';
  db.query(query, [user_id, group_id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send({ message: 'You are already in this group.' });
      }
      return res.status(500).send({ message: 'Failed to join group', error: err });
    }
    res.send({ message: '✅ Joined group successfully' });
  });
});

// ✅ Route: Get all groups a user belongs to
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  Group.getGroupsForUser(userId, (err, groups) => {
    if (err) return res.status(500).send('Error fetching groups');
    res.send(groups);
  });
});

module.exports = router;