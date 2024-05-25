import StockOpname from "../models/StockOpname.js";
import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import {Op} from "sequelize";


export const createStocks = async(req, res) =>{
    const {
        namaItem,
        tanggal,
        qty,
        tipeOpname,
        productId,
      } = req.body;
      try {
        await StockOpname.create({
            name : namaItem,
            tanggal: tanggal,
            qty : qty,
            tipeOpname : tipeOpname,
            userId : req.userId,
            productId: productId
        });
        res.status(201).json({msg:"Stock Opname Created Successfully" })
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

export const getStocks = async(req, res) =>{
    try {
        const response = await StockOpname.findAll({
            include:[{
                model : Users,
                attributes:['name', 'email']
            },
            {
              model: Products,
            },]
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}