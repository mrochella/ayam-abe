import express from "express";
import {
    getCartById,
    createCart
} from "../controller/Cart.js"
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.post('/cart',verifyUser, createCart);
router.get('/cart',verifyUser, getCartById);


export default router;