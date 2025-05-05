const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Submit profile info
router.post('/create', (req, res) => {
  const { user_id, preferred_position, preferred_foot } = req.body;

  Profile.create(user_id, preferred_position, preferred_foot, (err, id) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send('Profile already exists');
      }
      return res.status(500).send('Error creating profile');
    }

    res.send({ message: '✅ Profile created', profile_id: id });
  });
});

// (Optional) Get a user’s profile
router.get('/:user_id', (req, res) => {
  const { user_id } = req.params;

  Profile.getByUserId(user_id, (err, profile) => {
    if (err) return res.status(500).send('Error fetching profile');
    if (!profile) return res.status(404).send('Profile not found');
    res.send(profile);
  });
});

module.exports = router;
