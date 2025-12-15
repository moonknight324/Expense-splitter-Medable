import { render, screen, fireEvent, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import peopleReducer from '../slices/peopleSlice';
import expensesReducer from '../slices/expensesSlice';
import currencyReducer from '../slices/currencySlice';
import App from '../App';
import { describe, it, expect } from 'vitest';

const createTestStore = () => {
  return configureStore({
    reducer: {
      people: peopleReducer,
      expenses: expensesReducer,
      currency: currencyReducer,
    },
    preloadedState: {
      people: { people: ["Alice", "Bob", "Charlie", "Diana"] },
      expenses: { expenses: [] }
    }
  });
};

describe('Data Flow & State Management', () => {
  it('updates ExpenseForm dropdown when a person is added', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Initial check - dropdown should have initial people (Alice, Bob, Charlie, David)
    // But we can't easily check options without opening it or querying options.
    // Let's add a unique person.
    const newPerson = 'Zack';
    
    const nameInput = screen.getByPlaceholderText("Enter person's name");
    const addPersonBtn = screen.getByText('Add Person');

    fireEvent.change(nameInput, { target: { value: newPerson } });
    fireEvent.click(addPersonBtn);

    // Check if Zack appears in the "Paid By" dropdown
    const paidBySelect = screen.getByLabelText('Paid By');
    const option = within(paidBySelect).getByText(newPerson);
    expect(option).toBeInTheDocument();
    expect((option as HTMLOptionElement).value).toBe(newPerson);
  });

  it('updates BalanceView when an expense is added', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Add an expense for Alice
    const descInput = screen.getByPlaceholderText('What was the expense for?');
    const amountInput = screen.getByPlaceholderText('0.00');
    const paidBySelect = screen.getByLabelText('Paid By');
    const addExpenseBtn = screen.getByText('Add Expense');

    fireEvent.change(descInput, { target: { value: 'Test Expense' } });
    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.change(paidBySelect, { target: { value: 'Alice' } });
    
    // Alice pays 100. Split equally among 4 (Alice, Bob, Charlie, David).
    // Alice gets back 75. Others owe 25.
    
    fireEvent.click(addExpenseBtn);

    // Check BalanceView for Alice
    // Find the container for individual balances
    const balanceContainer = screen.getByText('Individual Balances').parentElement!;
    // Find Alice within that container
    const aliceRow = within(balanceContainer).getByText('Alice').closest('div');
    expect(aliceRow).toHaveTextContent('$75.00');
  });

  it('reflects changes in ExpenseList immediately', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const descInput = screen.getByPlaceholderText('What was the expense for?');
    const amountInput = screen.getByPlaceholderText('0.00');
    const paidBySelect = screen.getByLabelText('Paid By');
    const addExpenseBtn = screen.getByText('Add Expense');

    const uniqueDesc = 'Unique Expense 123';
    fireEvent.change(descInput, { target: { value: uniqueDesc } });
    fireEvent.change(amountInput, { target: { value: '50' } });
    fireEvent.change(paidBySelect, { target: { value: 'Bob' } });
    
    fireEvent.click(addExpenseBtn);

    expect(screen.getByText(uniqueDesc)).toBeInTheDocument();
  });
});
