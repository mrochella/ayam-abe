import express from "express";
import { getStocks, createStocks } from "../controller/StockOpname.js";

import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/stockopname', verifyUser, getStocks);
router.post('/stockopname',verifyUser, createStocks);

export default router;