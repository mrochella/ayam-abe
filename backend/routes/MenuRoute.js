import express from "express";
import {
    getMenus,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu
} from "../controller/Menu.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/menu', getMenus);
router.get('/menu/:id',verifyUser, getMenuById);
router.post('/menu',verifyUser, createMenu);
router.patch('/menu/:id',verifyUser, updateMenu);
router.delete('/menu/:id', verifyUser,  deleteMenu);

export default router;


