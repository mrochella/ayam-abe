import Cart from "../models/CartModel.js"
import CartDetail from "../models/CartDetail.js"
import Users from "../models/UserModel.js";
import {Op} from "sequelize";

export const getCartById = async(req, res) =>{
    try {
        const cart = await Cart.findOne({
            where : {
                userId: req.userId
            }
        });
        if(!cart) return res.status(404).json({msg: "Cart anda kosong"});
        const response = await Cart.findOne({
            where:{
                [Op.and]:[{id: cart.id}, {userId : req.userId}]
            },
            include:[{
                model : CartDetail
                // attributes:['name', 'price', 'url']
            }]
        });
        res.json(response);

    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

export const createCart = async(req, res) =>{
    const {tipePesanan, total, userType} = req.body;
    try {
        await Cart.create({
            tipePesanan : tipePesanan,
            total : total,
            userType : userType,
            userId : req.userId
        });
        res.status(201).json({msg:"Cart Created Successfully" })
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

export const getCarts = async(req, res) =>{
    try {
        const response = await Cart.findAll({
            include: [
                {
                  model: Users,
                  attributes: ["name", "email"],
                },
                {
                  model: CartDetail,
                },
              ],
        })
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

