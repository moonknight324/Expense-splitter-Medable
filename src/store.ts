import { configureStore } from '@reduxjs/toolkit';
import peopleReducer from './slices/peopleSlice';
import expensesReducer from './slices/expensesSlice';
import currencyReducer from './slices/currencySlice';
import { saveToStorage } from './utils/storage';

export const store = configureStore({
  reducer: {
    people: peopleReducer,
    expenses: expensesReducer,
    currency: currencyReducer,
  },
});

// Subscribe to store updates to persist state to localStorage
store.subscribe(() => {
  const state = store.getState();
  saveToStorage('expenseSplitter_people', state.people.people);
  saveToStorage('expenseSplitter_expenses', state.expenses.expenses);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
