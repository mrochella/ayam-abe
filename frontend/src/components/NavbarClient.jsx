import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoBagHandleOutline } from "react-icons/io5";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import logo from "../asset/logo.jpg";
import Swal from "sweetalert2";
import { getMe, LogOut, reset } from "../features/authSlice";
import { cartSelector } from "../features/cartSlice";
import { getCarts } from "../features/cartSlice";

const NavbarClient = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carts = useSelector(cartSelector.selectAll);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {user, isError, isSuccess, isLoading, message} = useSelector((state) => state.auth);
  const [totalQty, setTotalQty] = useState(0);
  const [uuidcart, setUuidCart] = useState("");
  const [nilaicart, setNilaiCart] = useState(null)

  useEffect(() => {
    console.log("nilai cart ke " + uuidcart )
    
    if(user){
      cekCart();
      dispatch(getCarts({ id: uuidcart }));
      if(uuidcart){
        const calculatedTotalQty = carts.reduce((totalQty, cart) => totalQty + cart.qty, 0);
      setTotalQty(calculatedTotalQty);
      }
      
    } 
  },[user])

  useEffect(() => {
    // Menjumlahkan qty dari setiap item di cartDetail
    console.log("nilai cart haahh " + uuidcart )
      const calculatedTotalQty = carts.reduce((totalQty, cart) => totalQty + cart.qty, 0);
    setTotalQty(calculatedTotalQty);
    
  }, [carts]);

  const cekCart = async () =>{
    console.log("masukkkk")
    
    const existingCart = await axios.get("http://localhost:5000/cart", {
      validateStatus: (status) => status < 500, // Resolve only if the status code is less than 500
    });
  
    if (existingCart.status === 200 && existingCart.data && Object.keys(existingCart.data).length > 0) {
      setUuidCart(existingCart.data.uuid)
      console.log("uuidnya " + existingCart.data.uuid)
      // setUuidCart(existingCart.data.uuid);
      // dispatch(getCarts({id: existingCart.data.uuid}));
      // Jika user sudah memiliki cart, langsung navigasi ke halaman car
      console.log("masuk1");
    } else {
      console.log("haloo eee");
      // Jika user belum memiliki cart, tambahkan cart baru
      const response = await axios.post("http://localhost:5000/cart", {
        tipePesanan: "dineIn",
        total: "0",
        userType: "buyer",
      });
    }
  }

  


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  
  const createCart = async () => {
    try {
      await axios.post("http://localhost:5000/cart", {
        tipePesanan: "dineIn",
        total: "0",
        userType: "buyer",
      });
      console.log("Cart created successfully");
    } catch (error) {
      console.error("Error creating transaction:", error.message);
    }
  };

  const handleClick = async () => {
    if (user && user.uuid) {
      try {
        // Pengecekan apakah user sudah memiliki cart dengan UUID tertentu
        const existingCart = await axios.get("http://localhost:5000/cart", {
          validateStatus: (status) => status < 500, // Resolve only if the status code is less than 500
        });
      
        if (existingCart.status === 200 && existingCart.data && Object.keys(existingCart.data).length > 0) {
          // Jika user sudah memiliki cart, langsung navigasi ke halaman cart
          navigate(`/clientcart/${existingCart.data.uuid}`);
          console.log("masuk1");
        } else {
          console.log("haloo eee");
          // Jika user belum memiliki cart, tambahkan cart baru
          const response = await axios.post("http://localhost:5000/cart", {
            tipePesanan: "dineIn",
            total: "0",
            userType: "buyer",
          });
      
          // Pastikan cart berhasil dibuat sebelum melakukan navigasi
          if (response.status === 201) {
            // Navigasi ke halaman cart yang baru dibuat
            navigate(`/clientcart/${response.data.uuid}`);
          } else {
            console.error("Error creating cart");
          }
        }
      } catch (error) {
        console.error("Error checking or creating cart:", error.message);
      }
      
    } else {
      Swal.fire("Error", "Maaf, Anda perlu login terlebih dahulu!", "error");
      navigate("/register");
    }
  };
  

  const handleLogout = () => {
    setTotalQty(0);
    setNilaiCart(null);
    setUuidCart("");
    console.log("delete");
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };
  return (
    <div>
      <nav
        className="navbar has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <NavLink to="/dashboard" className="navbar-item">
              <img
                src={logo}
                style={{ width: "40px", height: "40px" }}
                alt="logo"
                className="mr-6"
              />
            </NavLink>
            <span
              className={`navbar-burger burger ${
                isMenuOpen ? "is-active" : ""
              }`}
              data-target="navMenu"
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div
            id="navMenu"
            className={`navbar-menu is-justify-content-center ${
              isMenuOpen ? "is-active" : ""
            }`}
          >
            <div
              className="navbar-start"
              style={{ margin: "auto", fontSize: "1.2em" }}
            >
              <NavLink to="/" className="navbar-item">
                Home
              </NavLink>
              <NavLink to="/clientmenu" className="navbar-item">
                Menu
              </NavLink>
              <NavLink to="/clientlocation" className="navbar-item">
                Location
              </NavLink>
              <NavLink to="/clientcontact" className="navbar-item">
                Contact Us
              </NavLink>
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <button
                    to="/clientcart"
                    className="button is-rounded"
                    style={{ backgroundColor: "orange", color: "white" }}
                    onClick={handleClick}
                  >
                    <IoBagHandleOutline style={{ fontSize: "1.5em" }} />
                    <div
                      className="is-rounded ml-1"
                      style={{
                        backgroundColor: "white",
                        color: "orange",
                        padding: "2px",
                        paddingTop: "0",
                        paddingBottom: "0",
                        borderRadius: "10px",
                        paddingInline: "10px",
                      }}
                    >
                      {totalQty}
                    </div>
                  </button>
                  {user ? (
                    <button
                      className="button is-rounded ml-2 is-danger is-outlined"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  ) : (
                    <NavLink
                      to="/login"
                      className="button is-rounded ml-2 is-success is-outlined"
                    >
                      Login
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavbarClient;
