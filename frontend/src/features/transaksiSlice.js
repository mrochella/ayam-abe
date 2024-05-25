import { createSlice } from "@reduxjs/toolkit";

export const transSlice = createSlice({
    name : "transaction",
    initialState : {
        pesanan : "",
        total : 0,
        uuidTransaction: "",
        totalSebelumReset: 0,
        totalkembali: "",
        qtyCart: 0
    },
    reducers : {
        update: (state, action) =>{
            console.log("Payload:", action.payload);
            console.log("total kembali " + action.payload.totalkembali) ;
            state.pesanan = action.payload.deliveryOption;
            state.total = action.payload.totalfix;
            state.uuidTransaction = action.payload.uuidTransaction;
            state.totalSebelumReset = action.payload.totalbelum;
            state.totalkembali = action.payload.totallkembali;
            state.qtyCart = action.payload.qtyCart;
        }
    }
})

// export const saveStateToLocalStorage = (state) => {
//     localStorage.setItem("reduxState", JSON.stringify(state));
// };


export const {update} = transSlice.actions;
export default transSlice.reducer;