import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload; 
    },
  },
});

export const { setCartItems } = cartSlice.actions;

export default cartSlice.reducer;
