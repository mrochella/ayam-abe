import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { posSelector, getDetails, addDetails, deleteDetails } from "../features/posSlice";
// import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { update } from "../features/transaksiSlice";


const SidebarPos = ({ uuidTransaction }) => {
  //   const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [ppn, setPpn] = useState(0);
  const [service, setService] = useState(0);
  const [totalfix, setTotalFix] = useState(0);
  const [totalbelum, setTotalBelum] = useState(0);

  const dispatch = useDispatch();
  const menu = useSelector(posSelector.selectAll);
  const [deliveryOption, setDeliveryOption] = useState("dineIn");

  const handleOptionChange = (option) => {
    setDeliveryOption(option);
    console.log("Selected delivery option:", option);
  };

  const btnPlus = async(menuId, price) =>{
    const qty = 1;
     const subtotal = price * qty;
     const idTransaction = 0;
     console.log("uuidTransaction:", idTransaction); // Tambahkan ini
     console.log("subtotal:", subtotal); // Tambahkan ini
     console.log("subtotal:", subtotal); // Tambahkan ini
   
     try {
         await dispatch(addDetails({ menuId, idTransaction, qty, subtotal, uuidTransaction }));
         await dispatch(getDetails({id : uuidTransaction}));
     } catch (error) {
       console.error("Error choosing menu:", error.message);
     }
  } 

  const btnMinus = async(menuId, price) =>{
    const qty = 1;
    const subtotal = price * qty;
    const idTransaction = 0;
    console.log("uuidTransaction:", idTransaction); // Tambahkan ini
    console.log("subtotal:", subtotal); // Tambahkan ini
    console.log("subtotal:", subtotal); // Tambahkan ini
  
    try {
        await dispatch(deleteDetails({ menuId, idTransaction, qty, subtotal, uuidTransaction }));
        await dispatch(getDetails({id : uuidTransaction}));
    } catch (error) {
      console.error("Error choosing menu:", error.message);
    }
  }

  useEffect(() => {

    const fetchData = async () => {
      try {
        await dispatch(getDetails({ id: uuidTransaction }));
        await dispatch(update({ deliveryOption, totalfix, uuidTransaction, totalbelum}));
       
        // Lakukan hal-hal lain setelah mendapatkan detail
        // getCarts();
      } catch (error) {
        console.error("Error fetching details:", error.message);
        // Handle error jika diperlukan
      }
    };

    if (uuidTransaction) {
      fetchData();
      
    }
  }, [uuidTransaction, dispatch]);

  useEffect(() => {
    // Hitung total dari menu
    const newTotal = menu.reduce((acc, cart) => acc + Number(cart.subTotal), 0);
    const tenPercent = newTotal * 0.1;
    const fivePercent = newTotal * 0.05;
    const sumTotal = newTotal + tenPercent + fivePercent;

    const formattedNewTotal = newTotal.toLocaleString();
const formattedTenPercent = tenPercent.toLocaleString();
const formattedFivePercent = fivePercent.toLocaleString();
const formattedSumTotal = sumTotal.toLocaleString();
    // Update nilai total
    setTotal(formattedNewTotal);
    setPpn(formattedTenPercent);
    setService(formattedFivePercent);
    setTotalFix(formattedSumTotal);
    const jumlahFixTotal = parseInt(formattedSumTotal, 10);
    if(jumlahFixTotal > 0){
      console.log("nilainya" + jumlahFixTotal)
      setTotalBelum(formattedSumTotal);
    }
    
  }, [dispatch, menu]);

  // const getCarts = async () => {
  //   if (!uuidTransaction) {
  //     console.error("Uuid Transaction is not available.");
  //     return;
  //   }
  //   console.log("Uuid woi Transaction:", uuidTransaction);
  //   const response = await axios.get(`http://localhost:5000/details/${uuidTransaction}`);
  //   if (!response.data) {
  //     console.error("No data found for Uuid Transaction:", uuidTransaction);
  //     return;
  //   }
  //   setCart(response.data);
  // };

  // perbaiki ini !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  useEffect(() => {
    const updateTransaction = async () => {
      try {
        const jumlahFix = parseInt(totalfix, 10);
        // Periksa apakah totalfix lebih dari 0 sebelum mengirim pembaruan
        if (jumlahFix > 0) {
          const totallkembali = totalfix;
          console.log("hi berikut nilainya semua " + deliveryOption, totalfix, uuidTransaction, totalbelum);

          
          await dispatch(update({ deliveryOption, totalfix, uuidTransaction, totalbelum, totallkembali }));
          // setDeliveryOption("");
          // setTotalFix("");
        }
      } catch (error) {
        console.error("Error updating transaction:", error.message);
      }
    };
  
    // Panggil fungsi updateTransaction
    updateTransaction();
  }, [dispatch, deliveryOption, totalfix, uuidTransaction]);

  useEffect(() => {
    // Reset nilai deliveryOption dan totalfix saat uuidTransaction berubah
    setDeliveryOption("");
    setTotalFix("");
  }, [uuidTransaction]);


  return (
    <div>
      <aside>
        <div style={{ minHeight: "410px", overflow: "scroll" }}>
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th style={{ width: "30%" }}></th>
              <th>Qty</th>
              <th></th>
              <th>Harga</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((cart, index) => (
              <tr key={cart.uuid}>
                <td>{index + 1}</td>
                <td>{cart.menu && cart.menu.name}</td>
                <td><button
                class="button is-primary is-small"
                style={{
                  background:"tomato",
                  color:"white",
                  borderRadius: "50%",
                }}
                onClick={() => btnMinus(cart.menuId, cart.menu.price)}
                >-</button></td>
                <td>{cart.qty}</td>
                <td><button 
                class="button is-primary is-small"
                style={{
                  color:"white",
                  borderRadius: "50%",
                }}
                onClick={() => btnPlus(cart.menuId, cart.menu.price)}>+</button></td>
                <td>{cart.menu && cart.menu.price}</td>
                <td>{cart.subTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
       
        <div className="columns mt-3">
      <div className="column ml-5">
        <input
          type="radio"
          id="dineIn"
          name="deliveryOption"
          className="is-hidden"
          checked={deliveryOption === "dineIn"}
          onChange={() => handleOptionChange("dineIn")}
        />
        <label
          htmlFor="dineIn"
          className="button"
          style={{
            width: "130px",
            background: deliveryOption === "dineIn" ? "orange" : "white",
            color: deliveryOption === "dineIn" ? "white" : "orange",
            border: deliveryOption === "dineIn" ? "none" : "1px solid orange",
          }}
        >
          Dine In
        </label>
      </div>
      <div className="column">
        <input
          type="radio"
          id="takeAway"
          name="deliveryOption"
          className="is-hidden"
          checked={deliveryOption === "takeAway"}
          onChange={() => handleOptionChange("takeAway")}
        />
        <label
          htmlFor="takeAway"
          className="button"
          style={{
            width: "130px",
            background: deliveryOption === "takeAway" ? "dodgerblue" : "white",
            color: deliveryOption === "takeAway" ? "white" : "dodgerblue",
            border: deliveryOption === "takeAway" ? "none" : "1px solid dodgerblue",
          }}
        >
          Take Away
        </label>
      </div>
    </div>
        <div className="is-flex is-align-items-center">
          <p className="is-size-6 ml-2">Total Sebelum Pajak</p>
          <p className="is-size-6 has-text-right ml-auto">Rp {total}</p>
        </div>
        <div className="is-flex is-align-items-center">
          <p className="is-size-6 ml-2">Ppn</p>
          <p className="is-size-6 has-text-right ml-auto">Rp {ppn}</p>
        </div>
        <div className="is-flex is-align-items-center">
          <p className="is-size-6 ml-2">Service</p>
          <p className="is-size-6 has-text-right ml-auto">Rp {service}</p>
        </div>
        <div>
        <div style={{ background: "gray", paddingBottom: "1px", marginTop: "10px", marginLeft: "10px" }}></div>
        </div>
        <div className="is-flex is-align-items-center mt-3">
          <p className="is-size-4 ml-2">Total</p>
          <p className="is-size-5 has-text-right ml-auto">Rp {totalfix}</p>
        </div>
       
      </aside>
    </div>
  );
};

export default SidebarPos;
