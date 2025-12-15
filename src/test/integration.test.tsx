import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import peopleReducer from '../slices/peopleSlice';
import expensesReducer from '../slices/expensesSlice';
import currencyReducer from '../slices/currencySlice';
import App from '../App';
import { describe, it, expect } from 'vitest';

// Create a fresh store for testing
const createTestStore = () => {
  return configureStore({
    reducer: {
      people: peopleReducer,
      expenses: expensesReducer,
      currency: currencyReducer,
    },
    preloadedState: {
      people: { people: [] },
      expenses: { expenses: [] }
    }
  });
};

describe('Expense Splitter Integration Test', () => {
  it('should handle the full flow of adding people, expenses, and calculating balances', async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // 1. Add People
    const nameInput = screen.getByPlaceholderText("Enter person's name");
    const addPersonBtn = screen.getByText('Add Person');

    // Add Alice
    fireEvent.change(nameInput, { target: { value: 'Alice' } });
    fireEvent.click(addPersonBtn);
    const membersList = screen.getByText(/Current Members/).parentElement!;
    expect(within(membersList).getByText('Alice')).toBeInTheDocument();

    // Add Bob
    fireEvent.change(nameInput, { target: { value: 'Bob' } });
    fireEvent.click(addPersonBtn);
    expect(within(membersList).getByText('Bob')).toBeInTheDocument();

    // 2. Add Expense
    const descInput = screen.getByPlaceholderText('What was the expense for?');
    const amountInput = screen.getByPlaceholderText('0.00');
    const paidBySelect = screen.getByLabelText('Paid By');
    const addExpenseBtn = screen.getByText('Add Expense');

    fireEvent.change(descInput, { target: { value: 'Lunch' } });
    fireEvent.change(amountInput, { target: { value: '20' } });
    
    // Select Paid By Alice
    fireEvent.change(paidBySelect, { target: { value: 'Alice' } });

    // Ensure Bob is included in the split (he might not be if added after Alice due to ExpenseForm logic)
    const bobCheckbox = screen.getByRole('checkbox', { name: 'Bob' });
    if (!(bobCheckbox as HTMLInputElement).checked) {
      fireEvent.click(bobCheckbox);
    }
    
    fireEvent.click(addExpenseBtn);

    // 3. Verify Expense List
    await waitFor(() => {
      expect(screen.getByText('Lunch')).toBeInTheDocument();
      // Scope to Expense History to avoid ambiguity with Total Spending
      const expenseHistory = screen.getByText(/Expense History/i).parentElement!;
      expect(within(expenseHistory).getByText('$20.00')).toBeInTheDocument();
    });

    // 4. Verify Balances
    // Alice paid $20, split equally ($10 each). Alice paid $20, share is $10. Net: +$10.
    // Bob paid $0, share is $10. Net: -$10.

    // We look for specific text in the BalanceView
    // Note: The text might be split across elements, so we might need flexible matchers
    
    // Check Alice's balance
    // "Alice" ... "gets back" ... "$10.00"
    const balanceContainer = screen.getByText('Individual Balances').parentElement!;
    const aliceBalanceRow = within(balanceContainer).getByText('Alice').closest('div');
    expect(aliceBalanceRow).toHaveTextContent('gets back');
    expect(aliceBalanceRow).toHaveTextContent('$10.00');

    // Check Bob's balance
    const bobBalanceRow = within(balanceContainer).getByText('Bob').closest('div');
    expect(bobBalanceRow).toHaveTextContent('owes');
    expect(bobBalanceRow).toHaveTextContent('$10.00');

    // 5. Verify Settlement Plan
    // "Bob pays Alice" ... "$10.00"
    const settlementSection = screen.getByText(/Suggested Settlements/i).closest('div');
    expect(settlementSection).toHaveTextContent('Bob');
    expect(settlementSection).toHaveTextContent('Alice');
    expect(settlementSection).toHaveTextContent('$10.00');
  });
});
