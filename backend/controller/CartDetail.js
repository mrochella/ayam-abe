import Cart from "../models/CartModel.js";
import Menu from "../models/MenuModel.js";
import CartDetail from "../models/CartDetail.js";




export const getCartDetailById = async(req, res) =>{
    try {
        const cart = await Cart.findOne({
            where : {
                uuid: req.params.id
            }
        });

        if(!cart) return res.status(404).json({msg: "Data tidak ditemukan"});

        const response = await CartDetail.findAll({
            where:{
                cartId: cart.id
            },
            include:[{
                model : Menu,
                attributes:['name', 'price', 'image', 'url']
            }]
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createCartDetail = async(req, res) =>{
    const {menuId, cartId, qty, subTotal  } = req.body;
    try {
        await CartDetail.create({
            menuId : menuId,
            cartId: cartId,
            qty : qty,
            subTotal : subTotal
        });
        res.status(201).json({msg:"detail Cart Created Successfully" })
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

export const updateCartDetail = async (req, res) =>{
    const cartDetail = await CartDetail.findOne({
        where : {
            uuid: req.params.id
        }
    });
    if(!cartDetail) return res.status(404).json({msg: "Data tidak ditemukan"});

    const {menuId, qty, subTotal  } = req.body;
    try {
        await CartDetail.update({menuId, qty, subTotal},{
            where: {
                id : cartDetail.id
            }
        });
        res.status(201).json({msg:"detail Cart updated Successfully" })
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

export const deleteCartDetail = async (req, res) =>{
    const cart = await CartDetail.findOne({
        where : {
            uuid: req.params.id
        }
    });

    if(!cart) return res.status(404).json({msg: "Data tidak ditemukan"});
    try {
        await CartDetail.destroy({
            where : {
                id : cart.id
            }
        })
        res.status(200).json({msg : "Cart Deleted"});
    } catch (error) {
        res.status(400).json({msg : error.message});
    }
}