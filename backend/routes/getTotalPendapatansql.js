import express from 'express';
import db from "../config/Databasesql.js"


const router = express.Router();

router.get('/getTotalPendapatan', (req, res) => {
    const query = 'SELECT getGrossIncome() AS TotalPendapatan';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results);
      }
    });
  });

export default router;