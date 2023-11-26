import { createSlice } from "@reduxjs/toolkit";

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: [],
  reducers: {
    addInvoice: (state, action) => {
      state.push(action.payload);
      return state;
    },
    deleteInvoice: (state, action) => {
      const updatedState = state.filter((invoice) => invoice.id !== action.payload);
      return updatedState;
    },
    updateInvoice: (state, action) => {
      const index = state.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload.updatedInvoice;
      }
      return state;
    },
    updateBulkInvoice: (state, action) => {
      return action.payload;
    },
  },
});


export const {
  addInvoice,
  deleteInvoice,
  updateInvoice,
  updateBulkInvoice,
} = invoicesSlice.actions;

export const selectInvoiceList = (state) => state.invoices;

export default invoicesSlice.reducer;