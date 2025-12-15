# 💰 Expense Splitter Challenge

## Time Limit: 2 hours

Welcome to the Expense Splitter coding challenge! Your task is to build a fully functional React + TypeScript application that helps groups of people track and split expenses.

## 🚀 Project Setup & Execution Guide

Follow these step-by-step instructions to set up and run the Expense Splitter application on your local machine.

### 1. Prerequisites
- **Node.js**: Ensure you have Node.js installed (Version 16 or higher recommended).
- **npm**: Node Package Manager (usually comes with Node.js).

### 2. Installation
Open your terminal in the project directory and install the required dependencies:

```bash
npm install
```

### 3. Running the Application
Start the development server to view the app in your browser:

```bash
npm run dev
```
- The terminal will show a local URL (typically `http://localhost:5173`).
- Open this URL in your web browser.

### 4. Running Tests
To verify that all features are working correctly, run the test suite:

```bash
npm test
```
- This runs all unit and integration tests using Vitest.
- Press `q` to quit the test runner.

### 5. Building for Production
To create an optimized build for deployment:

```bash
npm run build
```
- The output will be generated in the `dist/` folder.
- You can preview the production build locally using `npm run preview`.

## 📖 Application Overview

The Expense Splitter helps groups of people (roommates, friends on trips, etc.) track shared expenses and calculate who owes whom. Users can:

1. Manage a group of people
2. Record expenses paid by members of the group
3. Specify how each expense should be split
4. See calculated balances and suggested settlements

The application currently displays initial sample data but needs full functionality implemented.

**📸 Visual Reference:** See the `screenshots/` folder for images of what the completed application should look like. These screenshots show all features working and can help you understand the requirements.

## 📋 Detailed Requirements

### 1. People Management

**What it does:** Manage the list of people in the expense-sharing group.

**Required Operations:**

- **Add Person:** Users should be able to add new people to the group by entering their name
- **Remove Person:** Users should be able to remove people from the group
- **Display List:** Show all current members with their names

**User Experience:**

- The form should clear after successfully adding a person
- Users should receive feedback when operations succeed or fail
- The current count of members should be visible

---

### 2. Expense Management

**What it does:** Record and track expenses paid by group members.

**Required Data for Each Expense:**

- **Description:** What the expense was for (e.g., "Dinner at restaurant")
- **Amount:** The monetary value in dollars
- **Paid By:** Which person paid for this expense
- **Date:** When the expense occurred
- **Split Between:** Which people should share this expense
- **Split Type:** How the expense should be divided
  - **Equal Split:** Divide amount equally among selected people
  - **Custom Split:** Specify exact amounts for each person

**Required Operations:**

- **Add Expense:** Create a new expense record with all required fields
- **Delete Expense:** Remove an expense from the list
- **View Details:** Display expense information including who paid and how it's split

**User Experience:**

- The form should provide all necessary input fields
- Display existing expenses in a clear, readable format
- Show the total count of expenses

---

### 3. Balance Calculation & Display

**What it does:** Calculate and display financial balances for the group.

**Required Calculations:**

- **Individual Balances:** For each person, calculate:
  - Total amount they paid for all expenses
  - Total amount they owe based on their share of expenses
  - Net balance (positive if owed money, negative if owing money)

- **Total Group Spending:** Sum of all expense amounts

- **Debt Simplification:** Calculate the minimum number of transactions needed to settle all debts
  - Example: If Alice owes Bob $20 and Bob owes Charlie $20, simplify to Alice pays Charlie $20

**Required Displays:**

- **Total Group Spending:** Show the overall sum
- **Individual Balances:** For each person show:
  - Their name
  - Whether they are owed money, owe money, or are settled up
  - The amount
- **Suggested Settlements:** Show simplified transactions (who should pay whom and how much)

---

### 4. State Management & Data Flow

**Challenge:** Components need to share data and communicate changes.

**Current State:**

- Components currently use `initialData.ts` for display only
- No data flows between components
- User actions don't update the application state

**What You Need to Implement:**

- **Shared State:** People and expenses data needs to be accessible across components
- **State Updates:** When users add/remove people or expenses, all relevant components should update
- **Component Communication:** Changes in one component should reflect in others
  - Adding a person in PeopleManager should update the dropdowns in ExpenseForm
  - Adding an expense should update the balances in BalanceView
  - The expense list in ExpenseList should reflect all expenses

**Data Structure Reference:**

- See `src/types.ts` for TypeScript interfaces
- See `src/initialData.ts` for example data structure

---

### 5. UI/UX Requirements

**Responsive Design:**

- Application should work on mobile devices (phone screens)
- Application should work on desktop/laptop screens
- Layout should adapt appropriately to different screen sizes

**User Feedback:**

- Users should know when their actions succeed
- Users should be informed when operations cannot be completed
- Loading states or transitions should feel smooth

**Intuitive Interface:**

- Forms should be easy to understand and fill out
- Navigation between different sections should be clear
- Information should be displayed in a logical, organized manner

---

### 6. Code Quality Requirements

**TypeScript:**

- Use proper types from `types.ts`
- Add additional types as needed
- Avoid `any` types where possible

**React Best Practices:**

- Use appropriate hooks for state management
- Follow React conventions for component structure
- Handle side effects properly

**Clean Code:**

- Components should have single, clear responsibilities
- Code should be readable and maintainable
- Remove unused code and console logs

## 🏗 Project Structure

```
src/
├── assets/                 # Static assets
├── components/
│   ├── BalanceView.tsx     # Show balances and settlements
│   ├── ExpenseForm.tsx     # Add new expenses
│   ├── ExpenseList.tsx     # List and manage expenses
│   └── PeopleManager.tsx   # Add/remove people
├── slices/
│   ├── expensesSlice.ts    # Redux slice for expenses
│   └── peopleSlice.ts      # Redux slice for people
├── test/
│   ├── setup.js            # Test setup configuration
│   └── *.test.tsx          # Unit and integration tests
├── utils/
│   ├── calculations.ts     # Business logic for balances
│   └── storage.ts          # LocalStorage persistence helper
├── App.tsx                 # Main app component
├── index.css               # Global styles
├── initialData.ts          # Sample data for reference
├── main.tsx                # App entry point
├── store.ts                # Redux store configuration
└── types.ts                # TypeScript type definitions
```

## 🎯 What We're Looking For

- **Problem-Solving:** How you approach building features from scratch
- **Architecture Decisions:** How you structure data flow and state management
- **TypeScript Usage:** Proper typing and type safety
- **React Proficiency:** Effective use of React patterns and hooks
- **Code Organization:** Clean, maintainable code structure
- **Attention to Detail:** Complete features that work correctly
- **UI/UX Sense:** User-friendly interface design
- **Responsive Design:** Mobile and desktop compatibility


## 📝 Submission Guidelines

1. Ensure the application runs without errors
2. Test all features to verify they work correctly
3. Commit your changes with clear, descriptive messages
4. Include brief notes about your approach (state management choice, architecture decisions, etc.)
5. List any assumptions you made
6. Note any incomplete features or known issues

Good luck! 🍀
