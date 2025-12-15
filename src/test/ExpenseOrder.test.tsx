import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import expensesReducer, { addExpense } from '../slices/expensesSlice';
import peopleReducer from '../slices/peopleSlice';
import ExpenseList from '../components/ExpenseList';
import { describe, it, expect } from 'vitest';
import React from 'react';

// Mock store setup
const createTestStore = () => configureStore({
  reducer: {
    expenses: expensesReducer,
    people: peopleReducer
  },
  preloadedState: {
    expenses: { expenses: [] }
  }
});

describe('ExpenseList Order', () => {
  it('displays the latest expense at the top', () => {
    const store = createTestStore();
    
    // Add first expense
    store.dispatch(addExpense({
      id: 1,
      description: 'First Expense',
      amount: 10,
      paidBy: 'A',
      splitBetween: ['A', 'B'],
      splitType: 'equal',
      date: '2024-01-01'
    }));

    // Add second expense
    store.dispatch(addExpense({
      id: 2,
      description: 'Second Expense',
      amount: 20,
      paidBy: 'B',
      splitBetween: ['A', 'B'],
      splitType: 'equal',
      date: '2024-01-02'
    }));

    render(
      <Provider store={store}>
        <ExpenseList />
      </Provider>
    );

    const expenseItems = screen.getAllByRole('heading', { level: 4 });
    // Currently, it should fail because the order is First, Second
    // We want Second, First
    expect(expenseItems[0]).toHaveTextContent('Second Expense');
    expect(expenseItems[1]).toHaveTextContent('First Expense');
  });
});
