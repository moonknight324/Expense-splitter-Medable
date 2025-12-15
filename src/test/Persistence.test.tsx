import { store } from '../store';
import { addPerson } from '../slices/peopleSlice';
import { addExpense } from '../slices/expensesSlice';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('Persistence (LocalStorage)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('saves people to localStorage when a person is added', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    
    const newPerson = 'PersistenceUser_' + Date.now();
    store.dispatch(addPerson(newPerson));
    
    expect(setItemSpy).toHaveBeenCalledWith(
      'expenseSplitter_people', 
      expect.stringContaining(newPerson)
    );
  });

  it('saves expenses to localStorage when an expense is added', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    
    const newExpense = {
      id: Date.now(),
      description: 'Persistence Test',
      amount: 50,
      paidBy: 'Alice',
      splitBetween: ['Alice', 'Bob'],
      splitType: 'equal' as const,
      date: '2024-01-01'
    };

    store.dispatch(addExpense(newExpense));
    
    expect(setItemSpy).toHaveBeenCalledWith(
      'expenseSplitter_expenses', 
      expect.stringContaining('Persistence Test')
    );
  });
});
