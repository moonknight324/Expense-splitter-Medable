# Project Brief & Implementation Notes

## Architecture & Approach
- **Framework**: React 19 with TypeScript for strict type safety.
- **State Management**: **Redux Toolkit** was chosen for centralized, predictable state management.
  - **Structure**: State is divided into `peopleSlice` and `expensesSlice` to isolate domain logic.
  - **Pattern**: Unidirectional data flow (Action → Store → UI Update).
- **Styling**: Tailwind CSS used for a mobile-first, responsive design system.
- **Testing**: Vitest and React Testing Library used for integration and component testing.

## Completed Tasks
1. **People management**: Added logic to add and remove people, with checks to stop the same person from being added twice.

2. **Expense management**: Built a solid expense form that handles the description, amount, who paid, and how the expense is split (equal or custom).

3. **Balance calculation**: Set up live balance updates so users can clearly see who owes money and who should get money back.

4. **Data flow checks**: Made sure changes in one part of the app update everywhere else, like new people showing up right away in expense dropdowns.

5. **Debt simplification**: Added logic to reduce multiple debts into the smallest number of payments needed to settle everything.

6. **Responsive UI**: Created a layout that works well on both mobile and desktop, stacking on small screens and showing sections side by side on larger ones.

7. **Data saving (extra feature)**: Used localStorage to save data so it stays after a page refresh, using the default data only on the very first load.

8. **UX improvements**: Changed the expense list so the newest expenses appear at the top.

9. **Currency Converter (extra feature)**: Integrated a currency converter into the expense form, allowing users to input amounts in USD, INR, AED, or EUR and automatically convert them for the split.

10. **Dark Mode (extra feature)**: Implemented a toggleable light/dark theme for better visual comfort, persisting the user's preference.

## Assumptions
- **Identity**: Person names are unique identifiers.
- **Splits**: "Equal Split" divides the total amount evenly among selected participants.

## Fixed Issues & Test Refinements
- **Selector ambiguity**: Fixed test errors where the same text appeared in multiple places by narrowing the search to the right section. For example, making sure the test picks “Alice” from the member list and not from the balance row.

- **Text mismatches**: Updated the tests to expect the exact text shown in the UI, like using “Suggested Settlements” instead of “Settlement Plan”.

- **State isolation**: Solved test failures caused by leftover data in localStorage by always starting tests with a clean, predefined state.

- **Integration logic**: Fixed integration tests to correctly handle form changes that happen at runtime, such as making sure newly added members are properly selected in split checkboxes.

## Known Issues
- **None**: All functional requirements are met, and the test suite is passing.
