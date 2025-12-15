import { Expense } from '../types';

export const calculateBalances = (people: string[], expenses: Expense[]): { [key: string]: number } => {
  const balances: { [key: string]: number } = {};

  // Initialize balances
  people.forEach(person => {
    balances[person] = 0;
  });

  expenses.forEach(expense => {
    // Add to payer's balance (they paid, so they are owed this amount initially)
    if (balances[expense.paidBy] !== undefined) {
      balances[expense.paidBy] += expense.amount;
    }

    // Subtract from splitters' balances (they owe this amount)
    expense.splitBetween.forEach(person => {
      if (balances[person] !== undefined) {
        let share = 0;
        if (expense.splitType === 'equal') {
          share = expense.amount / expense.splitBetween.length;
        } else if (expense.customAmounts) {
          share = expense.customAmounts[person] || 0;
        }
        balances[person] -= share;
      }
    });
  });

  return balances;
};

export const calculateSettlements = (balances: { [key: string]: number }): { from: string; to: string; amount: number }[] => {
  const settlements: { from: string; to: string; amount: number }[] = [];
  
  // Create deep copies to avoid mutating the balances object during calculation if we were using it elsewhere
  // But here we are just creating arrays from it.
  const debtors = Object.entries(balances)
    .filter(([_, amount]) => amount < -0.01)
    .map(([person, amount]) => ({ person, amount }))
    .sort((a, b) => a.amount - b.amount); // Ascending (most negative first)

  const creditors = Object.entries(balances)
    .filter(([_, amount]) => amount > 0.01)
    .map(([person, amount]) => ({ person, amount }))
    .sort((a, b) => b.amount - a.amount); // Descending (most positive first)

  let i = 0; // debtor index
  let j = 0; // creditor index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    // The amount to settle is the minimum of what the debtor owes and what the creditor is owed
    const amount = Math.min(Math.abs(debtor.amount), creditor.amount);
    
    if (amount > 0.01) {
      settlements.push({
        from: debtor.person,
        to: creditor.person,
        amount: amount
      });
    }

    // Update remaining amounts
    debtor.amount += amount;
    creditor.amount -= amount;

    // Move to next person if their balance is settled (close to zero)
    if (Math.abs(debtor.amount) < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return settlements;
};
