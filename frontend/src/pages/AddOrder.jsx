import React, { useState, useEffect } from "react";
import { IoPencil, IoTrash, IoSearch } from "react-icons/io5";
import LayoutPos from "./LayoutPos";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';
import { addDetails, getDetails, updateTransaction } from "../features/posSlice";
import Swal from "sweetalert2";
import { update } from "../features/transaksiSlice";

const AddOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isError, user} = useSelector((state => state.auth));

  useEffect(() =>{
    dispatch(getMe());
  },[dispatch]);

  useEffect(() =>{
    if(isError){
      navigate("/");
    }
    if(user && user.role !== "admin"){
      navigate("/dashboard")
    }
  },[isError, user, navigate]);


  const { pesanan, total } = useSelector(
    (state) => state.transaction
  );
  const [menus, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  const [categoryfix, setCategoryfix] = useState("");
  const [statusPembayaran, setStatusPembayaran] = useState("pending");
  const [tipePesanan, setTipePesanan] = useState(pesanan);
  const [localtotal, setLocalTotal] = useState(total);
  const [tokenPembayaran, setTokenPembayaran] = useState("bayarDitempat");
  const [tipePembayaran, setTipePembayaran] = useState("Qris Bca");
  const [userType, setUserType] = useState("cashier");
  const [receivedAmount, setReceivedAmount] = useState();
  const [changeAmount, setChangeAmount] = useState();
  const [idTransaction, setIdTransaction] = useState(null);
  const [uuidTransaction, setUuidTransaction] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [msg, setMsg] = useState("");
  const [selectedButton, setSelectedButton] = useState("");

  useEffect(() => {
    setTipePesanan(pesanan);
    setLocalTotal(total?.toString() || '');
    console.log("nilai setelahhh " + localtotal)// Convert total to string
  }, [pesanan, total]);
  

  
  const handleButtonClick = async (button) => {
    console.log("uuidnya " + uuidTransaction + "button " + button);
    let total = 0;
    if(button === "simpanOrder"){
      console.log("halo ini simpan order");
      // const tipePesanan = pesanan;
      setStatusPembayaran("pending");
      
      const parsedUangTotal = parseFloat(localtotal.replace(/[^0-9.-]+/g, ""));
      total = parsedUangTotal;
      console.log("totalnya " + total)
      if(total > 0){
        await axios.patch(`http://localhost:5000/transactions/${uuidTransaction}` ,{statusPembayaran, tipePesanan, total, tokenPembayaran, tipePembayaran, userType, receivedAmount, changeAmount });
        console.log("tersimpan")
        await dispatch(update({ deliveryOption: "", totalfix: 0}));
        console.log("setelah dispatchnya " + pesanan + total)
        setLocalTotal("");
        setTipePesanan("");
      }
      else{
        await axios.delete(`http://localhost:5000/transactions/${uuidTransaction}`);
        console.log("totalnya" + total);
        // console.log("terdelete");
      }
      navigate("/orders")
    }else if ( button === "bayarOrder"){
      console.log("halo ini bayar order" + pesanan + total);
      navigate("/orders/bayar");
    }else if (button === "buangOrder"){
      await axios.delete(`http://localhost:5000/transactions/${uuidTransaction}`);
      Swal.fire("Deleted Successfully", 'transaction has been deleted', 'success')
      navigate("/orders")
    }
    setSelectedButton(button);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/category");
        setCategory(response.data);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };

    const getIdTransaction = async () => {
      try {
        const response = await axios.get("http://localhost:5000/transactionss");
       
        // Asumsi respons dari server adalah array yang berisi objek
        if (response.length != 0) {
          // Mengambil id dari elemen pertama dalam array
          setIdTransaction(response.data.id);
          setUuidTransaction(response.data.uuid);
          console.log("ID Transaction berhasil diambil:", response.data.id);
          console.log("UUID Transaction berhasil diambil:", response.data.uuid);
        }else{
          console.log("Tidak ada data transaksi yang memenuhi kriteria");
        }
      } catch (error) {
        console.error("Error saat mengambil ID Transaction:", error.message);
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };

    getIdTransaction();
    // createTransaction();
    fetchData();
    getMenus();
  }, []);
 

  const getMenus = async () => {
    const response = await axios.get("http://localhost:5000/menu", {
      withCredentials: true,
    });
    setMenu(response.data);
  };


 

  const chooseMenu = async (menuId) => {

    // Assume qty is 1 and you get the price from your state or wherever it's stored
    const qty = 1;  // Set qty based on your logic
    const selectedMenu = menus.find((menu) => menu.id === menuId);
    const subtotal = selectedMenu.price * qty;

    console.log("uuidTransaction:", idTransaction); // Tambahkan ini
    console.log("subtotal:", subtotal); // Tambahkan ini
  
    try {
        await dispatch(addDetails({ menuId, idTransaction, qty, subtotal, uuidTransaction }));
        await dispatch(getDetails({id : uuidTransaction}));
    } catch (error) {
      console.error("Error choosing menu:", error.message);
    }
  };
  return (
    <LayoutPos uuidTransaction={uuidTransaction}>
      <div className="mt-4">
      {/* <SidebarPos uuidTransaction={uuidTransaction} /> */}
        <div className="columns is-multiline ">
          <div className="column is-one-quarter ">
            <div className="control has-icons-left">
              <input
                className="input"
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="icon is-left">
                <IoSearch />
              </span>
            </div>
          </div>
          <div className="column is-one-quarter "></div>
          <div className="column is-one-quarter "></div>
          <div className="column is-one-quarter pr-5 ">
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={categoryfix}
                  onChange={(e) => setCategoryfix(e.target.value)}
                >
                  <option value="">All Category</option>
                  {category.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="has-background-white mt-5 mr-4 px-4 pt-6"
        style={{ maxHeight: "430px", overflow: "scroll" }}
      >
        <div className="columns is-multiline">
          {menus
            .filter((menu) => {
              const isCategoryMatch =
                !categoryfix ||
                menu.category.name.toLowerCase() === categoryfix.toLowerCase();
              const isNameMatch = menu.name
                .toLowerCase()
                .includes(search.toLowerCase());
              return isCategoryMatch && (isNameMatch || !search);
            })
            .map((menu) => (
              <div className="column is-one-fifth" key={menu.id}>
                <div className="card card-shadow has-border-box" style={{ height: "300px" }}>
                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src={menu.url} alt={`Menu: ${menu.name}`} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="media">
                      <div className="media-content">
                        <p className="title is-6">{menu.name}</p>
                        <p className="title is-size-6 has-text-weight-medium">
                          Rp.{menu.price}
                        </p>
                      </div>
                    </div>
                  </div>
                  <footer className="card-footer">
                    <button
                      onClick={() => chooseMenu(menu.id)}
                      className="card-footer-item button is-small is-primary  mb-5 mx-2"
                    >
                      Choose
                    </button>
                  </footer>
                </div>
              </div>
            ))}
        </div>
      </div>
   
      <div className="buttons is-flex">
      <button
        className="button is-medium mx-3"
        style={{
          background:selectedButton === "buangOrder" ? "	tomato" : "white",
          color: selectedButton === "buangOrder" ? "white" : "tomato",
          border: selectedButton === "buangOrder" ? "none" : "1px solid tomato",
        }}
        onClick={() => handleButtonClick("buangOrder")}
      >
        Buang Order
      </button>
      <button
        className="button is-medium mx-3"
        style={{
          background: selectedButton === "simpanOrder" ? "orange" : "white",
          color: selectedButton === "simpanOrder" ? "white" : "orange",
          border: selectedButton === "simpanOrder" ? "none" : "1px solid orange",
        }}
        onClick={() => handleButtonClick("simpanOrder")}
      >
        Simpan Order
      </button>
      <button
        className="button is-medium mx-3"
        style={{
          background: selectedButton === "bayarOrder" ? "dodgerblue" : "white",
          color: selectedButton === "bayarOrder" ? "white" : "dodgerblue",
          border: selectedButton === "bayarOrder" ? "none" : "1px solid dodgerblue",
        }}
        onClick={() => handleButtonClick("bayarOrder")}
      >
        Bayar Order
      </button>
    </div>


    </LayoutPos>
  );
}

export default AddOrder;
