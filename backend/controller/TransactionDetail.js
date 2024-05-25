import TransactionDetail from "../models/TransactionDetailModel.js";
import Transaction from "../models/TransactionModel.js";
import Menu from "../models/MenuModel.js";
import {Op} from "sequelize";


export const getTransactionDetails = async (req, res) =>{
    try {
        const response = await TransactionDetail.findAll({
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

export const getTransactionDetailById = async (req, res) =>{
    try {
        const transaction = await Transaction.findOne({
            where : {
                uuid: req.params.id
            }
        });

        if(!transaction) return res.status(404).json({msg: "Data tidak ditemukan"});

        const response = await TransactionDetail.findAll({
            where:{
                transactionId: transaction.id
            },
            include:[{
                model : Menu,
                attributes:['name', 'price', 'url']
            }]
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createTransactionDetail = async (req, res) =>{
    const {menuId, idTransaction, qty, subtotal  } = req.body;
    try {
        await TransactionDetail.create({
            menuId : menuId,
            transactionId: idTransaction,
            qty : qty,
            subTotal : subtotal
        });
        res.status(201).json({msg:"detail Transaction Created Successfully" })
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

export const updateTransactionDetail = async (req, res) => {
    const transaction = await TransactionDetail.findOne({
        where : {
            uuid: req.params.id
        }
    });

    if(!transaction) return res.status(404).json({msg: "Data tidak ditemukan"});
    const {qty, subTotal } = req.body;
    try {
        await TransactionDetail.update(
            { qty: qty, subTotal: subTotal },
            {
                where: {
                    uuid: req.params.id
                }
            }
        );
        res.status(201).json({msg:"detail Transaction Created Successfully" })
    } catch (error) {
        res.status(500).json({msg : error.message});
    }
}

export const deleteTransactionDetail = async (req, res) =>{
    const transaction =  await TransactionDetail.findOne({
        where : {
            uuid: req.params.id
        }
    });
    if(!transaction) return res.status(404).json({msg: "Data tidak ditemukan"});
    try {
        await TransactionDetail.destroy({
            where : {
                id : transaction.id
            }
        });
        res.status(200).json({msg : "Detail Deleted"});
    } catch (error) {
        res.status(400).json({msg : error.message});
    }
}


