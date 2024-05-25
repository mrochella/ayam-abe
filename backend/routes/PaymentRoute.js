import express from "express"
import { createPayment } from "../controller/Payment.js"
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router()

router.post('/process-transaction',verifyUser, createPayment);

export default router