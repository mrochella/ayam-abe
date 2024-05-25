import React from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../asset/logo.jpg"
import { useDispatch, useSelector } from 'react-redux';
import {LogOut, reset} from "../features/authSlice";
import axios from 'axios';
import Swal from 'sweetalert2';

const NavbarPos = () => {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.auth);

  const { pesanan, total, uuidTransaction, totalSebelumReset, totalkembali } = useSelector(
    (state) => state.transaction
  );

  const logout = () =>{
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  }

  
  // totalnya tidak terupdate jika kembali

  const kembaliKeList = async(totall) =>{
    console.log("uuid" + uuidTransaction + "totalnya " + totall);
    const jumlahFix = parseInt(total, 10);
    console.log("ini totalnya " + jumlahFix)
    if(jumlahFix > 0){
        console.log("halo" + jumlahFix);
        const statusPembayaran = "Pending";
        const tokenPembayaran = "bayarditempat";
        const tipePembayaran = "Pending";
        const tipePesanan = pesanan;
        const userType = "cashier";
        const receivedAmount = 0;
        const changeAmount = 0;
        const total = totall;
        console.log("uuidd" + uuidTransaction);
        await axios.patch(
          `http://localhost:5000/transactions/${uuidTransaction}`,
          {
            statusPembayaran,
            tipePesanan,
            total,
            tokenPembayaran,
            tipePembayaran,
            userType,
            receivedAmount,
            changeAmount,
          }
        )
        navigate("/orders");
    }
    else{
        await axios.delete(`http://localhost:5000/transactions/${uuidTransaction}`);
        // Swal.fire("Deleted Successfully", 'transaction has been deleted', 'success')
        navigate("/orders");
    }
  }

  return (
    <div>
      <div>
      <nav className="navbar  is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <button className='button is-danger ml-6 mt-2' onClick={() => kembaliKeList(totalkembali)}> back </button>
          {/* <NavLink to="/dashboard" className="navbar-item " >
            <img src={logo} width="40" height="40" alt='logo' className='ml-10'/>
          </NavLink>
       */}
          <a href="!#" role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
      
        <div id="navbarBasicExample" className="navbar-menu">
      
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
               
                <button onClick={logout} className="button is-light">
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    </div>
  )
}

export default NavbarPos
