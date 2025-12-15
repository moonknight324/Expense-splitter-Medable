import { Expense } from './types';

export const initialPeople: string[] = ["Alice", "Bob", "Charlie", "Diana"];

export const initialExpenses: Expense[] = [
  {
    id: 1,
    description: "Lunch at restaurant",
    amount: 120,
    paidBy: "Alice",
    splitBetween: ["Alice", "Bob", "Charlie", "Diana"],
    date: "2024-01-28",
    splitType: "equal"
  },
  {
    id: 2,
    description: "Uber to airport",
    amount: 45,
    paidBy: "Bob",
    splitBetween: ["Bob", "Charlie"],
    date: "2024-01-27",
    splitType: "equal"
  },
  {
    id: 3,
    description: "Concert tickets",
    amount: 200,
    paidBy: "Charlie",
    splitBetween: ["Alice", "Charlie", "Diana"],
    date: "2024-01-26",
    splitType: "equal"
  }
];
