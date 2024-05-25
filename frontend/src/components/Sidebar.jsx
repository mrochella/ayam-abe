import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoPerson, IoClipboard, IoStorefront, IoLogOut, IoList, IoFastFoodSharp,IoFileTray, IoReceiptSharp, IoBarChart } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <div>
      <aside className="menu pl-2 has-shadow">
        <p className="menu-label" >General</p>
        <ul className="menu-list">
          <li >
            <NavLink to={"/dashboard"}>
              <IoStorefront className="mr-1" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to={"/products"}>
              <IoFileTray className="mr-1" />
              Inventory
            </NavLink>
          </li>
          <li>
            <NavLink to={"/orders"}>
              <IoReceiptSharp className="mr-1" />
              Orders
            </NavLink>
          </li>
        </ul>
        {user && user.role === "admin" && (
          <div>
            <p className="menu-label">Admin</p>
            <ul className="menu-list">
              <li>
                <NavLink to={"/users"}>
                  <IoPerson /> Users
                </NavLink>
              </li>
              <li>
                <NavLink to={"/stockopname"}>
                  <IoClipboard /> Stock
                </NavLink>
              </li>
              <li>
                <NavLink to={"/menu"}>
                  <IoFastFoodSharp /> Menu
                </NavLink>
              </li>
              <li>
                <NavLink to={"/category"}>
                  <IoList /> Category
                </NavLink>
              </li>
              <li>
                <NavLink to={"/report"}>
                  <IoBarChart /> Report
                </NavLink>
              </li>
            </ul>
          </div>
        )}

        <p className="menu-label">Settings</p>
        <ul className="menu-list">
          <li>
            <button onClick={logout} className="button is-white">
              <IoLogOut />
              Logout
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
