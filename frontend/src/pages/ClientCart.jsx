import React, { useEffect, useState } from "react";
import { IoTrash } from "react-icons/io5";
import NavbarClient from "../components/NavbarClient";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Ayam1 from "../asset/ayam1.jpg";
import Swal from "sweetalert2";
import {
  cartSelector,
  createCart,
  deleteCart,
  getCarts,
} from "../features/cartSlice";
import { addDetails } from "../features/posSlice";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ClientCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const carts = useSelector(cartSelector.selectAll);
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );
  const { id } = useParams();

  // const [name, setName] = useState("");
  // const [order_id, setOrder_id] = useState("");
  // const [total, setTotal] = useState("");
  const [token, setToken] = useState("");

  // console.log(carts);
  // // const [cart, setCart] = useState([]);
  // // useEffect(() =>{
  // //   data();
  // //   console.log(cart);
  // // },[])

  useEffect(() => {
    // Ambil data keranjang saat komponen dipasang
    dispatch(getCarts({ id }));
  }, [dispatch]);

  const calculateTotal = () => {
    return carts.reduce((total, cart) => total + parseFloat(cart.subTotal), 0);
  };

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const btnPlus = async (menuId, price, cartId) => {
    const qty = 1;
    const subTotal = price * qty;
    const idTransaction = 0;

    try {
      await dispatch(createCart({ menuId, cartId, qty, subTotal }));
      await dispatch(getCarts({ id }));
    } catch (error) {
      console.error("Error choosing menu:", error.message);
    }
  };

  const btnMinus = async (menuId, price, cartId) => {
    const qty = 1;
    const subTotal = price * qty;
    const idTransaction = 0;

    try {
      await dispatch(deleteCart({ menuId, cartId, qty, subTotal }));
      await dispatch(getCarts({ id }));
    } catch (error) {
      console.error("Error choosing menu:", error.message);
    }
  };

  const btnDelete = async (cartId) => {
    await axios.delete(`http://localhost:5000/cartdetail/${cartId}`);
    await dispatch(getCarts({ id }));
    Swal.fire(
      "Deleted Successfully",
      "transaction has been deleted",
      "success"
    );
  };

  const handleCheckout = async () => {
    try {
      // Step 1: Create Transaction
      const transactionResponse = await axios.post(
        "http://localhost:5000/transactions",
        {
          statusPembayaran: "pending",
          tipePesanan: "dineIn",
          total: calculateTotal(),
          tokenPembayaran: "bfcyuwvfyhuwhuajhefhbwe",
          tipePembayaran: "Payment BCA",
          userType: "buyer",
          receivedAmount: 0,
          changeAmount: 0,
        }
      );

      const idTransaction = transactionResponse.data.id;
      const uuidTransaction = transactionResponse.data.uuid;
      console.log("nilai transaksinya " + uuidTransaction)
      let data;
      let dataArray = [];
      // Step 2: Create Transaction Details
      for (const cartItem of carts) {
        data = {
          name: user.name,
          email: user.email,
          order_id: uuidTransaction,
          total: calculateTotal(),
          menuId: cartItem.menuId,
          price: cartItem.subTotal,
          qty: cartItem.qty,
          menuName: cartItem.menu.name,
        };
        dataArray.push(data);
        await dispatch(
          addDetails({
            menuId: cartItem.menuId,
            idTransaction,
            qty: cartItem.qty,
            subtotal: cartItem.subTotal,
            uuidTransaction,
          })
        );
      }

      // console.log(dataArray);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      

      const response = await axios.post(
        "http://localhost:5000/process-transaction",
        dataArray,
        config
      );

      setToken(response.data.token);

      // // Step 3: Delete Cart Items
      

      // // Refresh cart after successful checkout
      // await dispatch(getCarts({ id }));
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  useEffect(() => {
    if (token) {
      window.snap.pay(token, {
        onSuccess: async (result) => {
          
          const data = {
            statusPembayaran: "Complete",
            tipePesanan: "dineIn",
            total: result.gross_amount,
            tokenPembayaran: token,
            tipePembayaran: result.payment_type,
            userType: "buyer",
            receivedAmount: 0,
            changeAmount: 0,
          };
          const id = result.order_id;
          console.log(data.total);
          console.log(data);

          await axios.patch(`http://localhost:5000/transactions/${id}`, data);
          // localStorage.setItem("Pembayaran", JSON.stringify(result))
          for (const cartItem of carts) {
            await axios.delete(`http://localhost:5000/cartdetail/${cartItem.uuid}`);
          }
          setToken("");
          // Swal.fire(
          //   "Payment Successful",
          //   "Your order has been placed",
          //   "success"
          // );
          
        },
        onPending: (result) => {
          localStorage.setItem("Pembayaran", JSON.stringify(result));
          // setToken("");
        },
        onError: (error) => {
          console.log(error);
          // setToken("");
        },
        onClose: () => {
          console.log("Anda Belum Menyelesaikan Pembayaran");
          // setToken("");
        },
      });
    }
  }, [token]);

  useEffect(() => {
    const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    let scriptTag = document.createElement("script");

    scriptTag.src = midtransUrl;

    const midtransClientKey = "SB-Mid-client-bvdAkRQwbwOXIroT";
    scriptTag.setAttribute("data-client-key", midtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);
  // const data = async() =>{
  //   const response = await axios.get("http://localhost:5000/cart");
  //   setCart(response.data)
  // }
  return (
    <div>
      <NavbarClient />
      <div className="container mt-6">
        {carts.map((cart, index) => (
          <div className="is-flex is-flex-direction-column">
            <div className="is-flex is-flex-direction-row">
              <div>
                <figure className="image is-64x64 mt-5">
                  <img src={cart.menu.url} alt="Preview Image" />
                </figure>
              </div>
              <p className="mt-5 ml-6 is-size-5 has-text-weight-medium">
                {cart.menu.name}
              </p>
              <div
                className="is-flex is-flex-direction-row"
                style={{ marginLeft: "90px" }}
              >
                <button
                  className="mt-5 ml-6 px-4 is-small button is-danger is-outlined"
                  onClick={() =>
                    btnMinus(cart.menuId, cart.menu.price, cart.uuid)
                  }
                >
                  -
                </button>
                <p className="mt-5 ml-6 is-size-5 has-text-weight-medium">
                  {cart.qty}
                </p>
                <button
                  className="mt-5 ml-6 px-4 is-small button is-success is-outlined"
                  onClick={() =>
                    btnPlus(cart.menuId, cart.menu.price, cart.uuid)
                  }
                >
                  +
                </button>
              </div>
              <div
                className="is-flex is-flex-direction-row"
                style={{ marginLeft: "200px" }}
              >
                <p className="mt-5 ml-6 is-size-5 has-text-weight-medium">
                  {cart.menu.price}
                </p>
                <p className="mt-5 ml-6 is-size-5 has-text-weight-bold ml-5">
                  {cart.subTotal}
                </p>
                <button
                  className="mt-5 px-4 is-small button is-danger is-outlined"
                  style={{ marginLeft: "100px" }}
                  onClick={() => btnDelete(cart.uuid)}
                >
                  <IoTrash />
                </button>
              </div>
            </div>
            <div
              style={{
                background: "gray",
                paddingBottom: "1px",
                marginTop: "10px",
                marginLeft: "0px",
              }}
            ></div>
          </div>
        ))}

        <div className="is-flex is-justify-content-flex-end mt-6">
          <div>
            <p className="is-size-4">
              Total: {formatCurrency(calculateTotal())}
            </p>
            <div
              style={{
                background: "gray",
                paddingBottom: "1px",
                marginTop: "10px",
                marginLeft: "0px",
              }}
            ></div>
            <button
              className="button mt-3 ml-3 px-6 is-success is-outlined"
              onClick={() => handleCheckout()}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCart;
