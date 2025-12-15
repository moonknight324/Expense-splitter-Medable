import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense } from '../types';
import { initialExpenses } from '../initialData';
import { loadFromStorage } from '../utils/storage';

interface ExpensesState {
  expenses: Expense[];
}

const STORAGE_KEY = 'expenseSplitter_expenses';

const initialState: ExpensesState = {
  expenses: loadFromStorage(STORAGE_KEY, initialExpenses),
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload);
    },
    deleteExpense: (state, action: PayloadAction<number>) => {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
    },
  },
});

export const { addExpense, deleteExpense } = expensesSlice.actions;
export default expensesSlice.reducer;
