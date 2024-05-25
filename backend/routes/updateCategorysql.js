import express from 'express';
import db from '../config/Databasesql.js';
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();



router.patch('/updateCategorysql', (req, res) => {
  const { category_id, new_category_name } = req.body; // Pastikan bahwa body request menyertakan productId, name, dan price

  // Mengubah query untuk menambahkan parameter userId
  const query = 'CALL updateCategory(?, ?)';
  db.query(query, [category_id, new_category_name], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

export default router;
