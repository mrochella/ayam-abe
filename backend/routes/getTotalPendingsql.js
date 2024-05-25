import express from 'express';
import db from "../config/Databasesql.js"


const router = express.Router();

router.get('/getTotalPending', (req, res) => {
    const query = 'SELECT getPendingOrdersCount() AS PendingOrdersCount;';
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