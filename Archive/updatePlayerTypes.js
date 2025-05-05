const fs = require('fs');
const mysql = require('mysql2');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config();

// ✅ Setup DB connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'football_stats',
});

const filePath = path.join(__dirname, '..', 'ml-training', 'player_types.csv');

const updates = [];

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    updates.push(row);
  })
  .on('end', () => {
    console.log(`📥 Read ${updates.length} rows from player_types.csv`);

    updates.forEach(({ user_id, player_type }) => {
      const query = `UPDATE profiles SET player_type = ? WHERE user_id = ?`;

      connection.query(query, [player_type, user_id], (err, result) => {
        if (err) {
          console.error(`❌ Error updating user_id ${user_id}:`, err);
        } else {
          console.log(`✅ Updated user_id ${user_id} to ${player_type}`);
        }
      });
    });

    // Optional: Close DB after a short delay
    setTimeout(() => {
      connection.end();
      console.log('✅ Done. Connection closed.');
    }, 1000);
  });
