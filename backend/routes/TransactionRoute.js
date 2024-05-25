import express from "express";
import {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    getTransactionByCondition,
    deleteTransaction
} from "../controller/Transaction.js"

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/transactionss',verifyUser,adminOnly, getTransactionByCondition);
router.get('/transactions',verifyUser,adminOnly, getTransactions);
router.get('/transactions/:id',verifyUser,adminOnly, getTransactionById);
router.post('/transactions', verifyUser, createTransaction);
router.patch('/transactions/:id', verifyUser, updateTransaction);
router.delete('/transactions/:id', verifyUser,adminOnly, deleteTransaction);


export default router;