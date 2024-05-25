import express from 'express';
import db from '../config/Databasesql.js';
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.patch('/updateInventory', (req, res) => {
  const { productId, name, price, requesting_user_role } = req.body; // Pastikan bahwa body request menyertakan productId, name, dan price
//   const userId = req.userId; // Ambil userId dari req

  // Mengubah query untuk menambahkan parameter userId
  const query = 'CALL updateProduct(?, ?, ?, ?)';
  db.query(query, [productId, name, price,requesting_user_role], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

export default router;
