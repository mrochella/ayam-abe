import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import FileUpload from "express-fileupload"
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import MenuRoute from "./routes/MenuRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import TransactionRoute from "./routes/TransactionRoute.js";
import TransactionDetailRoute from "./routes/TransactionDetailRoute.js";
import CartRoute from "./routes/CartRoute.js";
import CartDetailRoute from "./routes/CartDetailRoute.js";
import PaymentRoute from "./routes/PaymentRoute.js";
import StockOpname from "./routes/StockOpname.js";
import getTotalPendapatansql from "./routes/getTotalPendapatansql.js";
import getTotalPendingsql from "./routes/getTotalPendingsql.js";
import getTotalCompletesql from "./routes/getTotalCompletesql.js";
import updateInventorysql from "./routes/updateInventorysql.js";
import updateCategorysql from "./routes/updateCategorysql.js";
import ViewOrderListsql from "./routes/ViewOrderListsql.js";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});
// (async ()=>{
//     await db.sync();
// })();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
app.use(MenuRoute);
app.use(CategoryRoute);
app.use(TransactionRoute);
app.use(TransactionDetailRoute);
app.use(CartRoute);
app.use(CartDetailRoute);
app.use(PaymentRoute);
app.use(StockOpname);
app.use(getTotalPendapatansql);
app.use(getTotalPendingsql);
app.use(getTotalCompletesql);
app.use(updateInventorysql);
app.use(updateCategorysql);
app.use(ViewOrderListsql);

// store.sync();

app.listen(process.env.APP_PORT, () =>{
    console.log("Server Up And running...")
});