import { createSlice } from '@reduxjs/toolkit';

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [],
  },
  reducers: {
    setExpenses(state, action) {
      state.items = action.payload;
    },
    addExpense(state, action) {
      state.items.push(action.payload);
    },
    updateExpense(state, action) {
      const index = state.items.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteExpense(state, action) {
      state.items = state.items.filter((e) => e.id !== action.payload);
    },
  },
});

export const expenseActions = expenseSlice.actions;
export default expenseSlice.reducer;
