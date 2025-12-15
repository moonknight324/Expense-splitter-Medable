import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { calculateBalances, calculateSettlements } from '../utils/calculations';

function BalanceView() {
  const people = useSelector((state: RootState) => state.people.people);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);

  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balances = calculateBalances(people, expenses);
  const settlements = calculateSettlements(balances);

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        💰 Balances
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg mb-6">
        <span>Total Group Spending:</span>
        <strong className="text-2xl">${totalSpending.toFixed(2)}</strong>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-600 my-2 text-lg">Individual Balances</h3>
        {people.map((person) => {
          const balance = balances[person] || 0;
          let balanceClass = "bg-gray-100 border-gray-300";
          let textClass = "text-gray-600";
          let statusText = "settled up";
          
          if (balance > 0.01) {
            balanceClass = "bg-green-50 border-green-200";
            textClass = "text-green-600";
            statusText = "gets back";
          } else if (balance < -0.01) {
            balanceClass = "bg-red-50 border-red-200";
            textClass = "text-red-600";
            statusText = "owes";
          }

          return (
            <div
              key={person}
              className={`flex flex-col sm:flex-row justify-between items-center px-3 py-3 mb-2 rounded-md transition-all hover:translate-x-1 border ${balanceClass}`}
            >
              <span className="font-medium text-gray-800">{person}</span>
              <span className="flex items-center gap-2">
                <span className={`text-sm ${textClass}`}>{statusText}</span>
                <strong className={`text-lg ${textClass}`}>${Math.abs(balance).toFixed(2)}</strong>
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-gray-600 my-2 text-lg">💸 Suggested Settlements</h3>
        <p className="text-xs text-gray-500 mb-3">Minimum transactions to settle all debts:</p>
        {settlements.length === 0 ? (
          <div className="text-center py-8 bg-green-100 rounded-lg text-green-900 font-medium">
            <p>✅ All balances are settled!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {settlements.map((settlement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold text-red-500">{settlement.from}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-semibold text-green-600">{settlement.to}</span>
                </div>
                <strong className="text-gray-800">${settlement.amount.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BalanceView;
