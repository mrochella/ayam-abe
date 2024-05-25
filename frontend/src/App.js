import {BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import Products from "./pages/Products";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Category from "./pages/Category";
import AddCategory from "./pages/AddCategory";
import EditCategory from "./pages/EditCategory";
import Menu from "./pages/Menu";
import AddMenu from "./pages/AddMenu";
import EditMenu from "./pages/EditMenu";
import Orders from "./pages/Orders";
import AddOrder from "./pages/AddOrder";
import BayarOrder from "./pages/BayarOrder";
import EditOrder from "./pages/EditOrder";
import Report from "./pages/Report";
import HomePage from "./pages/HomePage";
import ClientMenuPage from "./pages/ClientMenuPage";
import ClientLocation from "./pages/ClientLocation";
import ClientContact from "./pages/ClientContact";
import ClientCart from "./pages/ClientCart";
import Register from "./components/Register";
import Stocks from "./pages/Stocks";
import AddStocks from "./pages/AddStocks";

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/users" element={<Users/>}/>
        <Route path="/users/add" element={<AddUser/>}/>
        <Route path="/users/edit/:id" element={<EditUser/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/products/add" element={<AddProduct/>}/>
        <Route path="/products/edit/:id" element={<EditProduct/>}/>
        <Route path="/category" element={<Category/>}/>
        <Route path="/category/add" element={<AddCategory/>}/>
        <Route path="/category/edit/:id" element={<EditCategory/>}/>
        <Route path="/menu" element={<Menu/>}/>
        <Route path="/menu/add" element={<AddMenu/>}/>
        <Route path="/menu/edit/:id" element={<EditMenu/>}/>
        <Route path="/orders" element={<Orders/>}/>
        <Route path="/orders/add" element={<AddOrder/>}/>
        <Route path="/orders/bayar" element={<BayarOrder/>}/>
        <Route path="/orders/edit/:id" element={<EditOrder/>}/>
        <Route path="/report" element={<Report/>}/>
        <Route path="/clientmenu" element={<ClientMenuPage/>}/>
        <Route path="/clientlocation" element={<ClientLocation/>}/>
        <Route path="/clientcontact" element={<ClientContact/>}/>
        <Route path="/clientcart/:id" element={<ClientCart/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/stockopname" element={<Stocks/>}/>
        <Route path="/stockopname/add" element={<AddStocks/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
