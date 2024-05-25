import {createSlice, createAsyncThunk, createEntityAdapter} from "@reduxjs/toolkit";
import {selectPosByMenuId} from "./selectorPos"
import axios from "axios";

export const getDetails = createAsyncThunk("pos/getDetails", async({id}) =>{
    const response = await axios.get(`http://localhost:5000/details/${id}`);
    return response.data;
});

let qtyNow;

export const addDetails = createAsyncThunk("pos/addDetails", async({menuId, idTransaction, qty, subtotal, uuidTransaction }, {getState}) =>{
    try {
        
        // Cari pos dengan menuId yang sesuai di dalam state
        console.log("Menu ID:", menuId);
        console.log("berikut ituuu nilainya " + menuId, idTransaction, qty, subtotal);
        console.log("State:", getState());
        const existingPos = selectPosByMenuId(getState(), menuId);
        console.log("Existing Pos:", existingPos);
    
        if (existingPos) {
            console.log("berikut itu nilainya " + menuId, idTransaction, qty, subtotal);
            console.log("uuid " + existingPos.uuid)
          // Jika pos dengan menuId sudah ada, update qty dan subTotal
          const updatedPos = { qty: existingPos.qty + qty, subTotal: parseFloat(existingPos.subTotal) + parseFloat(subtotal)};
          const response = await axios.patch(`http://localhost:5000/details/${existingPos.uuid}`, updatedPos);
          return { pos: updatedPos, isUpdate: true };
        } else {
          // Jika pos dengan menuId belum ada, buat pos baru
          console.log("berikut ini nilainya " + menuId, idTransaction, qty, subtotal);
          const response = await axios.post("http://localhost:5000/details", {
            menuId,
            idTransaction,
            qty,
            subtotal
          });
          return { pos: response.data, isUpdate: false };
        }
      } catch (error) {
        throw error;
      }
});

export const updateTransaction = createAsyncThunk("pos/updateTransaction", async({uuidTransaction, statusPembayaran, tipePesanan, total, tokenPembayaran, tipePembayaran, userType, receivedAmount, changeAmount}) => {
  try {
    const response = await axios.patch(`http://localhost:5000/transactions/${uuidTransaction}`,{
      statusPembayaran, tipePesanan,  total, tokenPembayaran, tipePembayaran, userType, receivedAmount, changeAmount
    });
    return response.data
  } catch (error) {
    throw error;
  }
})

export const deleteDetails = createAsyncThunk("pos/deleteDetails", async({menuId, idTransaction, qty, subtotal, uuidTransaction }, {getState}) => {
  const existingPos = selectPosByMenuId(getState(), menuId);
  try {
    
    if (existingPos) {
      console.log("berikut itu nilainya " + menuId, idTransaction, qty, subtotal);
      console.log("uuid " + existingPos.uuid)
    // Jika pos dengan menuId sudah ada, update qty dan subTotal
    qtyNow = existingPos.qty - qty;
    if(qtyNow > 0){
      const updatedPos = { qty: existingPos.qty - qty, subTotal: parseFloat(existingPos.subTotal) - parseFloat(subtotal)};
      const response = await axios.patch(`http://localhost:5000/details/${existingPos.uuid}`, updatedPos);
      return { pos: updatedPos, isUpdate: true };
    }
    else{
      const response = await axios.delete(`http://localhost:5000/details/${existingPos.uuid}`);
      return existingPos.uuid;
    }
  }
  } catch (error) {
    throw error;
  }

})




const posEntity = createEntityAdapter({
    selectId: (pos) => pos.id
});

const initialState = posEntity.getInitialState();

const posSlice = createSlice({
    name : "pos",
    initialState : initialState,
    extraReducers: (builder) => {
        builder
          .addCase(addDetails.fulfilled, (state, action) => {
            const { pos, isUpdate } = action.payload;
    
            if (isUpdate) {
              // Jika update, gunakan updateOne
              posEntity.updateOne(state, { id: pos.id, changes: pos });
            } else {
              // Jika add one, gunakan addOne
              posEntity.addOne(state, pos);
            }
          })
          .addCase(getDetails.fulfilled, (state, action) => {
            posEntity.setAll(state, action.payload);
          })
          .addCase(deleteDetails.fulfilled, (state, action) =>{
            const { pos, isUpdate } = action.payload;
            if (isUpdate) {
              // Jika update, gunakan updateOne
              posEntity.updateOne(state, { id: pos.id, changes: pos });
            } else {
              posEntity.removeOne(state, action.payload);
            }
          })
      }
});

export const { actions } = posSlice;
export const posSelector = posEntity.getSelectors(state => state.pos);
export default posSlice.reducer;