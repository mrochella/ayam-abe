import express from 'express';
import db from "../config/Databasesql.js"


const router = express.Router();

router.get('/getTotalComplete', (req, res) => {
    const query = 'SELECT getCompleteOrdersCount() AS CompleteOrdersCount;';
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