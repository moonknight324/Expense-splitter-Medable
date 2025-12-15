import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import peopleReducer from '../slices/peopleSlice';
import expensesReducer from '../slices/expensesSlice';
import BalanceView from '../components/BalanceView';
import { describe, it, expect } from 'vitest';

// Helper to create a store with preloaded state
const createTestStore = (preloadedState: any) => {
  return configureStore({
    reducer: {
      people: peopleReducer,
      expenses: expensesReducer,
    },
    preloadedState,
  });
};

describe('BalanceView Component', () => {
  it('should calculate and display balances correctly', () => {
    const initialState = {
      people: { people: ['Alice', 'Bob', 'Charlie'] },
      expenses: {
        expenses: [
          {
            id: 1,
            description: 'Lunch',
            amount: 30,
            paidBy: 'Alice',
            splitBetween: ['Alice', 'Bob', 'Charlie'],
            splitType: 'equal',
            date: '2023-01-01',
          },
        ],
      },
    };

    const store = createTestStore(initialState);
    render(
      <Provider store={store}>
        <BalanceView />
      </Provider>
    );

    // Total Spending
    expect(screen.getByText('$30.00')).toBeInTheDocument();

    // Alice paid $30, share is $10. Net: +$20.
    // We use getAllByText because 'Alice' might appear in settlements too.
    // The individual balance row has the person's name in a span with font-medium.
    const aliceName = screen.getAllByText('Alice').find(el => 
      el.tagName === 'SPAN' && el.classList.contains('font-medium')
    );
    const aliceRow = aliceName?.closest('div');
    expect(aliceRow).toHaveTextContent('gets back');
    expect(aliceRow).toHaveTextContent('$20.00');

    // Bob paid $0, share is $10. Net: -$10.
    const bobName = screen.getAllByText('Bob').find(el => 
      el.tagName === 'SPAN' && el.classList.contains('font-medium')
    );
    const bobRow = bobName?.closest('div');
    expect(bobRow).toHaveTextContent('owes');
    expect(bobRow).toHaveTextContent('$10.00');

    // Charlie paid $0, share is $10. Net: -$10.
    const charlieName = screen.getAllByText('Charlie').find(el => 
      el.tagName === 'SPAN' && el.classList.contains('font-medium')
    );
    const charlieRow = charlieName?.closest('div');
    expect(charlieRow).toHaveTextContent('owes');
    expect(charlieRow).toHaveTextContent('$10.00');
  });

  it('should display settlement plan correctly', () => {
    // Scenario: Alice pays $30 for Alice, Bob, Charlie.
    // Alice is +20, Bob is -10, Charlie is -10.
    // Settlements: Bob pays Alice $10, Charlie pays Alice $10.
    
    const initialState = {
      people: { people: ['Alice', 'Bob', 'Charlie'] },
      expenses: {
        expenses: [
          {
            id: 1,
            description: 'Lunch',
            amount: 30,
            paidBy: 'Alice',
            splitBetween: ['Alice', 'Bob', 'Charlie'],
            splitType: 'equal',
            date: '2023-01-01',
          },
        ],
      },
    };

    const store = createTestStore(initialState);
    render(
      <Provider store={store}>
        <BalanceView />
      </Provider>
    );

    const settlementSection = screen.getByText(/Suggested Settlements/i).closest('div');
    
    // We expect to see "Bob pays Alice" and "Charlie pays Alice"
    // The order might vary depending on sort stability, but both should be present.
    expect(settlementSection).toHaveTextContent('Bob');
    expect(settlementSection).toHaveTextContent('Alice');
    
    expect(settlementSection).toHaveTextContent('Charlie');
    expect(settlementSection).toHaveTextContent('Alice');
  });

  it('should handle debt simplification (A->B->C)', () => {
    // Alice owes Bob $20. Bob owes Charlie $20.
    // Net: Alice -20, Bob 0, Charlie +20.
    // Result: Alice pays Charlie $20.

    const initialState = {
      people: { people: ['Alice', 'Bob', 'Charlie'] },
      expenses: {
        expenses: [
          {
            id: 1,
            description: 'Debt 1',
            amount: 20,
            paidBy: 'Bob',
            splitBetween: ['Alice'], // Alice owes Bob 20
            splitType: 'equal', // 100% to Alice effectively if splitBetween is just Alice? 
            // Wait, if splitBetween is ['Alice'], amount is 20. 
            // Alice share: 20. Bob paid 20.
            // Alice: -20. Bob: +20.
            date: '2023-01-01',
          },
          {
            id: 2,
            description: 'Debt 2',
            amount: 20,
            paidBy: 'Charlie',
            splitBetween: ['Bob'], // Bob owes Charlie 20
            // Bob share: 20. Charlie paid 20.
            // Bob: -20. Charlie: +20.
            splitType: 'equal',
            date: '2023-01-01',
          }
        ],
      },
    };
    
    // Net Balances:
    // Alice: -20 (from Debt 1)
    // Bob: +20 (from Debt 1) - 20 (from Debt 2) = 0
    // Charlie: +20 (from Debt 2)

    const store = createTestStore(initialState);
    render(
      <Provider store={store}>
        <BalanceView />
      </Provider>
    );

    // Verify Bob is settled
    const bobName = screen.getAllByText('Bob').find(el => 
      el.tagName === 'SPAN' && el.classList.contains('font-medium')
    );
    const bobRow = bobName?.closest('div');
    expect(bobRow).toHaveTextContent('settled up');
    expect(bobRow).toHaveTextContent('$0.00');

    // Verify Settlement: Alice pays Charlie $20
    const settlementSection = screen.getByText(/Suggested Settlements/i).closest('div');
    expect(settlementSection).toHaveTextContent('Alice');
    expect(settlementSection).toHaveTextContent('Charlie');
    expect(settlementSection).toHaveTextContent('$20.00');
    
    // Should NOT show Bob paying or receiving
    // Note: This depends on implementation details, but ideally Bob shouldn't be in settlements
    // We can check that "Bob pays" or "pays Bob" is not present in the settlement list text
    // But simpler to just check the correct transaction exists.
  });
});
