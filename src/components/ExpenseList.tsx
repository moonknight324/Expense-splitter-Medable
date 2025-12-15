import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deleteExpense } from '../slices/expensesSlice';

function ExpenseList() {
  const dispatch = useDispatch();
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const displayExpenses = [...expenses].reverse();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(id));
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        📝 Expense History
      </h2>

      {displayExpenses.length === 0 ? (
        <p className="text-center text-gray-400 py-8 italic">
          No expenses added yet. Add your first expense to get started!
        </p>
      ) : (
        <div>
          {displayExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-gray-50 rounded-lg mb-4 border border-gray-200 overflow-hidden"
            >
              <div 
                className="p-4 flex justify-between items-center cursor-pointer transition-colors hover:bg-gray-100"
                onClick={() => toggleExpand(expense.id)}
              >
                <div className="flex-1">
                  <h4 className="text-gray-800 mb-1 text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    {expense.description}
                  </h4>
                  <div className="flex gap-4 text-gray-600 text-sm">
                    <span>{formatDate(expense.date)}</span>
                    <span>Paid by <strong>{expense.paidBy}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-semibold text-gray-700">
                    {expense.originalCurrency && expense.originalCurrency !== 'USD' && expense.originalAmount
                      ? `${expense.originalCurrency} ${expense.originalAmount.toFixed(2)}`
                      : `$${(expense.originalAmount || expense.amount).toFixed(2)}`
                    }
                  </span>
                  <button
                    className={`bg-transparent text-gray-600 px-2 py-1 transition-transform duration-200 ${expandedId === expense.id ? 'rotate-90' : ''}`}
                    aria-label="Expand"
                  >
                    ▶
                  </button>
                </div>
              </div>
              
              {expandedId === expense.id && (
                <div className="p-4 border-t border-gray-200 bg-white animate-fadeIn">
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Split Type: <span className="capitalize font-medium">{expense.splitType}</span></p>
                    <p className="text-sm text-gray-600">Split Between:</p>
                    <ul className="mt-1 space-y-1">
                      {expense.splitBetween.map(person => {
                        let amount = 0;
                        const useOriginal = expense.originalCurrency && expense.originalCurrency !== 'USD' && expense.originalAmount;
                        const totalAmount = useOriginal ? expense.originalAmount! : expense.amount;

                        if (expense.splitType === 'equal') {
                          amount = totalAmount / expense.splitBetween.length;
                        } else if (expense.customAmounts) {
                          const storedAmount = expense.customAmounts[person] || 0;
                          if (useOriginal) {
                            // Calculate rate from totals to reverse the conversion
                            const rate = expense.originalAmount! / expense.amount;
                            amount = storedAmount * rate;
                          } else {
                            amount = storedAmount;
                          }
                        }
                        
                        const currencyDisplay = useOriginal ? `${expense.originalCurrency} ` : '$';

                        return (
                          <li key={person} className="flex justify-between text-sm pl-2 border-l-2 border-indigo-200">
                            <span>{person}</span>
                            <span className="font-medium">{currencyDisplay}{amount.toFixed(2)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={(e) => handleDelete(expense.id, e)}
                      className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      🗑️ Delete Expense
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-700">
        <p>
          Total Expenses: <strong>{expenses.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default ExpenseList;
