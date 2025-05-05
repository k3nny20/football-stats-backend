const express = require('express');
const router = express.Router();
const Stat = require('../models/Stat');

// Route: Submit a new stat entry
router.post('/submit', (req, res) => {
  const {
    goals,
    assists,
    pass_rating,
    dribbling_rating,
    defensive_rating,
    positions,
    match_date,
    user_id,
    group_id
  } = req.body;

  // Coefficients from your trained model
  const coefficients = {
    goals: 0.47933411,
    assists: 0.23135032,
    pass: 0.20868507,
    dribble: 0.27099869,
    defense: 0.04749019
  };
  const intercept = 3.1954509641771294;

  // Predict match rating using ML formula
  const predicted_rating =
    intercept +
    (goals * coefficients.goals) +
    (assists * coefficients.assists) +
    (pass_rating * coefficients.pass) +
    (dribbling_rating * coefficients.dribble) +
    (defensive_rating * coefficients.defense);

  const match_rating = parseFloat(predicted_rating.toFixed(2)); // round to 2 decimals

  // Create the stat entry
  const statData = {
    goals,
    assists,
    pass_rating,
    dribbling_rating,
    defensive_rating,
    match_rating, // 🔁 override manual input if provided
    positions,
    match_date,
    user_id,
    group_id
  };

  // Save to DB
  Stat.submit(statData, (err, id) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error submitting stat');
    }
    res.send({ message: '✅ Stat submitted with predicted rating', rating: match_rating, stat_id: id });
  });
});


// Route: Get all stats in a group
router.get('/group/:group_id', (req, res) => {
  const group_id = req.params.group_id;

  Stat.getByGroup(group_id, (err, stats) => {
    if (err) return res.status(500).send('Error fetching stats');
    res.send(stats);
  });
});

// Get all stats for a specific user (across all groups)
router.get('/user/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  Stat.getByUserId(user_id, (err, stats) => {
    if (err) return res.status(500).send('Error fetching user stats');
    res.send(stats);
  });
});

module.exports = router;
