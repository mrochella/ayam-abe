import Transaction from "../models/TransactionModel.js";
import Users from "../models/UserModel.js";
import TransactionDetail from "../models/TransactionDetailModel.js";
import moment from "moment/moment.js";
import Menu from "../models/MenuModel.js";

export const getTransactions = async (req, res) => {
  try {
    const response = await Transaction.findAll({
      include: [
        {
          model: Users,
          attributes: ["name", "email"],
        },
        {
          model: TransactionDetail,
          attributes: ["menuId", "qty", "subTotal"],
        },
      ],
    });
    const formattedResponse = response.map((item) => {
      return {
        ...item.dataValues,
        tanggal: moment(item.tanggal).format("YYYY-MM-DD HH:mm:ss"), // Ubah format sesuai kebutuhan
      };
    });

    res.json(formattedResponse);
  } catch (error) {
    console.log(error.message);
  }
};

export const getTransactionByCondition = async (req, res) => {
  try {
    const transactions = await Transaction.findOne({
      where: {
        statusPembayaran: "pending",
        total: 0.00,
      },
    });

    if (transactions.length === 0) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }

    res.json(transactions);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!transaction)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    const response = await Transaction.findOne({
      where: {
        id: transaction.id,
      },
      include: [
        {
          model: TransactionDetail,
          // attributes:['name', 'price', 'url']
        },
      ],
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createTransaction = async (req, res) => {
  const {
    statusPembayaran,
    tipePesanan,
    total,
    tokenPembayaran,
    tipePembayaran,
    userType,
    receivedAmount,
    changeAmount,
  } = req.body;
  try {
    const transaction = await Transaction.create({
      statusPembayaran: statusPembayaran,
      tipePesanan: tipePesanan,
      total: total,
      tokenPembayaran: tokenPembayaran,
      tipePembayaran: tipePembayaran,
      userType: userType,
      receivedAmount: receivedAmount,
      changeAmount: changeAmount,
      userId: req.userId,
    });

    res.status(201).json({ msg: "Transaction Created Successfully", id: transaction.id, uuid: transaction.uuid});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!transaction)
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    const {
      statusPembayaran,
      tipePesanan,
      total,
      tokenPembayaran,
      tipePembayaran,
      userType,
      receivedAmount,
      changeAmount,
    } = req.body;
    await Transaction.update(
      {
        statusPembayaran,
        tipePesanan,
        total,
        tokenPembayaran,
        tipePembayaran,
        userType,
        receivedAmount,
        changeAmount,
      },
      {
        where: {
          id: transaction.id,
        },
      }
    );
    res.status(201).json({ msg: "Transaction Updated Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteTransaction = async(req, res) =>{
  try {
    const transaksi = await Transaction.findOne({
      where : {
        uuid: req.params.id
    }
    });
    if(!transaksi) return res.status(404).json({msg: "Data tidak ditemukan"});

    await Transaction.destroy({
      where: {
        id : transaksi.id
      }
    })
    res.status(200).json({msg : "Product Deleted Succesfully"});
  } catch (error) {
    res.status(500).json({msg : error.message});
  }
}
