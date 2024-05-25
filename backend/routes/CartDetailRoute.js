import express from "express";
import {
    getCartDetailById,
    createCartDetail,
    updateCartDetail,
    deleteCartDetail
} from "../controller/CartDetail.js"
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/cartdetail/:id',verifyUser, getCartDetailById);
router.post('/cartdetail', verifyUser, createCartDetail);
router.patch('/cartdetail/:id', verifyUser, updateCartDetail);
router.delete('/cartdetail/:id', verifyUser, deleteCartDetail);

export default router;