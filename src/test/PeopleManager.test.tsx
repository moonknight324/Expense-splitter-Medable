import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import peopleReducer from '../slices/peopleSlice';
import expensesReducer from '../slices/expensesSlice';
import PeopleManager from '../components/PeopleManager';
import { describe, it, expect } from 'vitest';

// Helper to render with Redux
const renderWithRedux = (component: React.ReactElement, preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      people: peopleReducer,
      expenses: expensesReducer,
    },
    preloadedState,
  });
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('PeopleManager', () => {
  it('renders initial people', () => {
    renderWithRedux(<PeopleManager />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('adds a new person', () => {
    renderWithRedux(<PeopleManager />);
    
    const input = screen.getByPlaceholderText("Enter person's name");
    const addButton = screen.getByText('Add Person');

    fireEvent.change(input, { target: { value: 'Eve' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Eve')).toBeInTheDocument();
    expect(screen.getByText('Added Eve successfully')).toBeInTheDocument();
  });

  it('prevents adding empty name', () => {
    renderWithRedux(<PeopleManager />);
    
    const addButton = screen.getByText('Add Person');
    fireEvent.click(addButton);

    expect(screen.getByText('Name cannot be empty')).toBeInTheDocument();
  });

  it('prevents adding duplicate name', () => {
    renderWithRedux(<PeopleManager />);
    
    const input = screen.getByPlaceholderText("Enter person's name");
    const addButton = screen.getByText('Add Person');

    fireEvent.change(input, { target: { value: 'Alice' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Person already exists')).toBeInTheDocument();
  });

  it('prevents adding duplicate name (case-insensitive)', () => {
    renderWithRedux(<PeopleManager />);
    
    const input = screen.getByPlaceholderText("Enter person's name");
    const addButton = screen.getByText('Add Person');

    fireEvent.change(input, { target: { value: 'alice' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Person already exists')).toBeInTheDocument();
  });

  it('removes a person', () => {
    renderWithRedux(<PeopleManager />);
    
    // Add a person first so we have > 2 people
    const input = screen.getByPlaceholderText("Enter person's name");
    const addButton = screen.getByText('Add Person');
    fireEvent.change(input, { target: { value: 'Eve' } });
    fireEvent.click(addButton);

    const removeButton = screen.getByLabelText('Remove Eve');
    fireEvent.click(removeButton);

    expect(screen.queryByText('Eve')).not.toBeInTheDocument();
    expect(screen.getByText('Removed Eve')).toBeInTheDocument();
  });

  it('prevents removing person if only 2 people left', () => {
    // Initial state has 4 people: Alice, Bob, Charlie, Diana
    // We need to remove 2 to get to 2, then try to remove another
    const { store } = renderWithRedux(<PeopleManager />, {
      people: { people: ['Alice', 'Bob'] }
    });

    const removeButton = screen.getByLabelText('Remove Alice');
    fireEvent.click(removeButton);

    expect(screen.getByText('Cannot remove person. Minimum 2 people required.')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('prevents removing person if involved in expenses', () => {
    const preloadedState = {
      people: { people: ['Alice', 'Bob', 'Charlie'] },
      expenses: {
        expenses: [
          {
            id: 1,
            description: 'Test',
            amount: 10,
            paidBy: 'Alice',
            splitBetween: ['Alice', 'Bob'],
            date: '2024-01-01',
            splitType: 'equal'
          }
        ]
      }
    };
    
    renderWithRedux(<PeopleManager />, preloadedState);

    // Try to remove Alice (payer and splitter)
    const removeAlice = screen.getByLabelText('Remove Alice');
    fireEvent.click(removeAlice);
    expect(screen.getByText('Cannot remove person involved in expenses.')).toBeInTheDocument();

    // Try to remove Bob (splitter)
    const removeBob = screen.getByLabelText('Remove Bob');
    fireEvent.click(removeBob);
    expect(screen.getByText('Cannot remove person involved in expenses.')).toBeInTheDocument();

    // Try to remove Charlie (not involved)
    const removeCharlie = screen.getByLabelText('Remove Charlie');
    fireEvent.click(removeCharlie);
    expect(screen.getByText('Removed Charlie')).toBeInTheDocument();
  });
});
