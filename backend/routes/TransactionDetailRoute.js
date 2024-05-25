import express from "express";
import {
    getTransactionDetails,
    getTransactionDetailById,
    createTransactionDetail,
    updateTransactionDetail,
    deleteTransactionDetail
} from "../controller/TransactionDetail.js"

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/details', verifyUser,adminOnly, getTransactionDetails);
router.get('/details/:id',verifyUser,adminOnly, getTransactionDetailById);
router.post('/details',verifyUser, createTransactionDetail);
router.patch('/details/:id',verifyUser, updateTransactionDetail);
router.delete('/details/:id',verifyUser, deleteTransactionDetail);


export default router;