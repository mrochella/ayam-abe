import midtransClient from "midtrans-client"

export const createPayment = (req, res) => {
    try {
        const snap = new midtransClient.Snap({
            isProduction : false,
            serverKey: "SB-Mid-server-lEFj0yHDs4L-hrHIUZi9mTBs",
            clientKey: "SB-Mid-client-bvdAkRQwbwOXIroT"
        })

        const parameter = {
            transaction_details: {
                order_id: req.body[0].order_id,
                gross_amount: req.body[0].total,
              },
              customer_details: {
                first_name: req.body[0].name,
                email: req.body[0].email,
              },
              item_details: req.body.map(item => ({
                id: item.menuId,
                price: item.price,
                quantity: item.qty,
                name: item.menuName,
              })),
            finish_redirect_url: "http://localhost:3000/",
        }

        snap.createTransaction(parameter).then((transaction) => {
            const dataPayment = {
                response: JSON.stringify(transaction)
            }
            const token = transaction.token;

            res.status(200).json({message : "Berhasil", dataPayment, token: token})
        })

       
    } catch (error) {
        res.status(500).json({msg: error.msg})
    }
}