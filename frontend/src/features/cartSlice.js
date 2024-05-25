import {createSlice, createAsyncThunk, createEntityAdapter} from "@reduxjs/toolkit";
import {selectPosByMenuId} from "./selectorCart"
import axios from "axios";

export const getCarts = createAsyncThunk("cart/getCarts", async({id}) =>{
    const response = await axios.get(`http://localhost:5000/cartdetail/${id}`);
    return response.data;
});

let qtyNow;

export const createCart = createAsyncThunk("cart/createCart", async({menuId, cartId, qty, subTotal }, {getState}) =>{
    try {
        console.log("masuk create Cart")
        const existingPos = selectPosByMenuId(getState(), menuId);
        // const updatedPos = { qty: existingPos.qty + qty, subTotal: parseFloat(existingPos.subTotal) + parseFloat(subtotal)};
        if (existingPos) {
            console.log("uuid " + existingPos.uuid)
          // Jika pos dengan menuId sudah ada, update qty dan subTotal
          const updatedPos = { qty: existingPos.qty + qty, subTotal: parseFloat(existingPos.subTotal) + parseFloat(subTotal)};
          const response = await axios.patch(`http://localhost:5000/cartdetail/${existingPos.uuid}`, updatedPos);
          return { cart: updatedPos, isUpdate: true };
        } else {
          // Jika pos dengan menuId belum ada, buat pos baru
          const response = await axios.post("http://localhost:5000/cartdetail", {
            menuId,
            cartId,
            qty,
            subTotal
          });
          return { cart: response.data, isUpdate: false };
        }
    } catch (error) {
        throw error;
    }
})

export const deleteCart = createAsyncThunk("cart/deleteCart", async({menuId, cartId, qty, subTotal }, {getState}) =>{
    const existingPos = selectPosByMenuId(getState(), menuId);
    try {
        if (existingPos) {
            console.log("uuid " + existingPos.uuid)
          // Jika pos dengan menuId sudah ada, update qty dan subTotal
          qtyNow = existingPos.qty - qty;
          if(qtyNow > 0){
            const updatedPos = { qty: existingPos.qty - qty, subTotal: parseFloat(existingPos.subTotal) - parseFloat(subTotal)};
            const response = await axios.patch(`http://localhost:5000/cartdetail/${existingPos.uuid}`, updatedPos);
            return { cart: updatedPos, isUpdate: true };
          }
          else{
            const response = await axios.delete(`http://localhost:5000/cartdetail/${existingPos.uuid}`);
            return existingPos.uuid;
          }
        //   return { cart: response.data, isUpdate: false };
        }
    } catch (error) {
        throw error;
    }
})

// export const deleteDetails = createAsyncThunk("pos/deleteDetails", async({menuId, id, qty, subtotal, uuidTransaction }, {getState}) => {
//     const existingPos = selectPosByMenuId(getState(), menuId);
//     try {
      
//       if (existingPos) {
//         // console.log("berikut itu nilainya " + menuId, idTransaction, qty, subtotal);
//         console.log("uuid " + existingPos.uuid)
//       // Jika pos dengan menuId sudah ada, update qty dan subTotal
    //   qtyNow = existingPos.qty - qty;
//       if(qtyNow > 0){
//         const updatedPos = { qty: existingPos.qty - qty, subTotal: parseFloat(existingPos.subTotal) - parseFloat(subtotal)};
//         const response = await axios.patch(`http://localhost:5000/cartdetail/${existingPos.uuid}`, updatedPos);
//         return { pos: updatedPos, isUpdate: true };
//       }
//       else{
//         const response = await axios.delete(`http://localhost:5000/cartdetail/${existingPos.uuid}`);
//         return existingPos.uuid;
//       }
//     }
//     } catch (error) {
//       throw error;
//     }
  
//   })



const cartEntity = createEntityAdapter({
    selectId: (cart) => cart.id
});

const initialState = cartEntity.getInitialState();

const cartSlice = createSlice({
    name : "cart",
    initialState : initialState,
    extraReducers : (builder) =>{
        builder
          .addCase(createCart.fulfilled, (state, action) => {
            const { cart, isUpdate } = action.payload;
    
            if (isUpdate) {
              // Jika update, gunakan updateOne
              cartEntity.updateOne(state, { id: cart.id, changes: cart });
            } else {
              // Jika add one, gunakan addOne
              cartEntity.addOne(state, cart);
            }
          })
          .addCase(getCarts.fulfilled, (state, action) => {
            cartEntity.setAll(state, action.payload);
          })
          .addCase(deleteCart.fulfilled, (state, action) =>{
            const { cart, isUpdate } = action.payload;
            if (isUpdate) {
              // Jika update, gunakan updateOne
              cartEntity.updateOne(state, { id: cart.id, changes: cart });
            } else {
              cartEntity.removeOne(state, action.payload);
            }
          })
    }
})

export const { actions } = cartSlice;
export const cartSelector = cartEntity.getSelectors(state => state.cart);
export default cartSlice.reducer;
