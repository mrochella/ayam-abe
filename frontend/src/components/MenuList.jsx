import React, { useState, useEffect } from "react";
import { IoPencil, IoTrash, IoSearch, IoAdd } from "react-icons/io5";
import axios from "axios";
import { Link } from "react-router-dom";

const MenuList = () => {
  const [menus, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  const [categoryfix, setCategoryfix] = useState("");
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
    fetchData();
    getMenus();
  }, []);

  const getMenus = async () => {
    const response = await axios.get("http://localhost:5000/menu", {
      withCredentials: true,
    });
    setMenu(response.data);
  };

  const deleteMenu = async (menuId) => {
    await axios.delete(`http://localhost:5000/menu/${menuId}`);
    getMenus();
  };
  return (
    <div>
      <div className="container is-flex is-justify-content-space-between mt-3">
        <h1 className="title">Menu</h1>
        <Link to="/menu/add" className="button is-primary mb-3 mr-4 ">
          <IoAdd className="mr-3" />
          Add New
        </Link>
      </div>
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

      <div className="has-background-white mt-5 mr-4 px-4 pt-6"  style={{ maxHeight: "430px", overflow: "scroll" }}>
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
                <div className="card card-shadow has-border-box">
                  <div className="card-image">
                    <figure className="image is-4by3">
                      <img src={menu.url} alt={`Menu: ${menu.name}`} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="media">
                      <div className="media-content">
                        <p className="title is-5">{menu.name}</p>
                        <p className="title is-size-6 has-text-weight-medium">
                          Rp.{menu.price}
                        </p>
                      </div>
                    </div>
                  </div>
                  <footer className="card-footer">
                    <Link
                      to={`edit/${menu.uuid}`}
                      className="card-footer-item button is-small is-info mb-5 mx-2"
                    >
                      <IoPencil className="mr-3" /> Edit
                    </Link>
                    <button
                      onClick={() => deleteMenu(menu.uuid)}
                      className="card-footer-item button is-small is-danger  mb-5 mx-2"
                    >
                      <IoTrash className="mr-3" />
                      Delete
                    </button>
                  </footer>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MenuList;
