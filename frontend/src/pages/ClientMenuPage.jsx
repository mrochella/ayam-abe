import React, { useState, useEffect } from "react";
import { IoPencil, IoTrash, IoSearch } from "react-icons/io5";
import NavbarClient from '../components/NavbarClient'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { createCart, getCarts } from "../features/cartSlice";
import Swal from "sweetalert2";

import { getMe, LogOut, reset } from "../features/authSlice";


const ClientMenuPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user, isError, isSuccess, isLoading, message} = useSelector((state) => state.auth);
  

  const [menus, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  const [categoryfix, setCategoryfix] = useState("");
  const [cartid, setCartId] = useState("");
  const [cartuuid, setCartUuid] = useState("");
  
  const [msg, setMsg] = useState("");

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

    if(user){
      const getIdCart = async () => {
        try {
          const response = await axios.get("http://localhost:5000/cart");
          // Asumsi respons dari server adalah array yang berisi objek
          if (response.length != 0) {
            // Mengambil id dari elemen pertama dalam array
            setCartId(response.data.id);
            setCartUuid(response.data.uuid);
            console.log("ID Transaction berhasil diambil:", response.data.id);
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
  
      getIdCart();
    }
   
    // // createTransaction();
    fetchData();
    getMenus();
  }, [user]);

  const getMenus = async () => {
    const response = await axios.get("http://localhost:5000/menu", {
      withCredentials: true,
    });
    setMenu(response.data);
  };

  const chooseMenu = async (menuId) => {
    if (user) {
      console.log(user.name);
      // const existingCart = await axios.get("http://localhost:5000/cart");
      // navigate(`/clientcart/${existingCart.data.uuid}`);
      // navigate("/clientcart");
      const qty = 1;  // Set qty based on your logic
      const selectedMenu = menus.find((menu) => menu.id === menuId);
      const subTotal = selectedMenu.price * qty;
      const cartId = cartid;
    
      try {
          await dispatch(createCart({menuId, cartId, qty, subTotal }));
          await dispatch(getCarts({id : cartuuid}));
      } catch (error) {
        console.error("Error choosing menu:", error.message);
      }
    } else {
      Swal.fire("Warning", "maaf anda perlu daftar lebih dahulu!", "warning");
      navigate("/register");
    }

    // Assume qty is 1 and you get the price from your state or wherever it's stored
  
  };

  return (
    <div>
      <NavbarClient/>
      <div className='containerr' style={{ height: "100vh"}}>
        <div className='is-flex is-justify-content-center py-6' style={{ backgroundColor: "orange" }}>
        <p className='is-size-1 is-white has-text-weight-bold' style={{ color: "#D91319" }}>Menu</p>
        </div>

       <div className="container">
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
              <div className="column is-one-quarter mt-6" key={menu.id}>
                <div className="card card-shadow has-border-box mb-6 " style={{ height: "400px" }}>
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
                      className="card-footer-item button is-small mb-5 mx-2 is-size-5"
                      style={{ color: "white", backgroundColor: "#D91319" }}>
                      + Pesan Sekarang
                    </button>
                  </footer>
                </div>
              </div>
            ))}
        </div>
      </div>
       </div>
      </div>
    </div>
  )
}

export default ClientMenuPage
