import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addExpense } from '../slices/expensesSlice';
import { fetchExchangeRates } from '../slices/currencySlice';
import { Expense, SupportedCurrency } from '../types';

const CURRENCY_OPTIONS: { code: SupportedCurrency; label: string }[] = [
  { code: 'USD', label: 'USD - US Dollar' },
  { code: 'INR', label: 'INR - Indian Rupee' },
  { code: 'AED', label: 'AED - Dirham' },
  { code: 'EUR', label: 'EUR - Euro' },
];

function ExpenseForm() {
  const dispatch = useDispatch<AppDispatch>();
  const people = useSelector((state: RootState) => state.people.people);
  const { rates, status } = useSelector((state: RootState) => state.currency);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<{ [person: string]: number }>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExchangeRates());
    }
  }, [status, dispatch]);

  // Initialize splitBetween with all people when people list changes
  useEffect(() => {
    if (people.length > 0 && splitBetween.length === 0) {
      setSplitBetween(people);
    }
  }, [people]);

  const handleCurrencyChange = (newCurrency: SupportedCurrency) => {
    if (!amount || isNaN(parseFloat(amount))) {
      setCurrency(newCurrency);
      return;
    }

    const rateFrom = rates[currency];
    const rateTo = rates[newCurrency];

    if (rateFrom && rateTo) {
      // Convert current amount to USD, then to new currency
      const inUSD = parseFloat(amount) / rateFrom;
      const converted = inUSD * rateTo;
      setAmount(converted.toFixed(2));
    }
    setCurrency(newCurrency);
  };

  const handleSplitBetweenChange = (person: string) => {
    if (splitBetween.includes(person)) {
      setSplitBetween(splitBetween.filter(p => p !== person));
    } else {
      setSplitBetween([...splitBetween, person]);
    }
  };

  const handleCustomAmountChange = (person: string, value: string) => {
    setCustomAmounts({
      ...customAmounts,
      [person]: parseFloat(value) || 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!description.trim()) {
      setFeedback({ type: 'error', message: 'Description is required' });
      return;
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid amount' });
      return;
    }

    if (!paidBy) {
      setFeedback({ type: 'error', message: 'Please select who paid' });
      return;
    }

    if (splitBetween.length === 0) {
      setFeedback({ type: 'error', message: 'Please select at least one person to split with' });
      return;
    }

    if (splitType === 'custom') {
      const totalCustom = Object.entries(customAmounts)
        .filter(([person]) => splitBetween.includes(person))
        .reduce((sum, [_, val]) => sum + val, 0);
      
      if (Math.abs(totalCustom - numAmount) > 0.01) {
        setFeedback({ type: 'error', message: `Custom amounts must sum to ${numAmount}. Current: ${totalCustom}` });
        return;
      }
    }

    const newExpense: Expense = {
      id: Date.now(),
      description,
      amount: numAmount,
      paidBy,
      splitBetween,
      date,
      splitType,
      customAmounts: splitType === 'custom' ? customAmounts : undefined
    };

    dispatch(addExpense(newExpense));
    
    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaidBy('');
    setSplitType('equal');
    setSplitBetween(people);
    setCustomAmounts({});
    
    setFeedback({ type: 'success', message: 'Expense added successfully!' });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        💸 Add Expense
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 text-gray-700 font-medium text-sm">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was the expense for?"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1 mb-4">
            <label htmlFor="amount" className="block mb-1 text-gray-700 font-medium text-sm">
              Amount
            </label>
            <div className="flex">
              <input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-l-md text-base transition-colors focus:outline-none focus:border-indigo-500 border-r-0"
              />
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value as SupportedCurrency)}
                className="px-3 py-2 border-2 border-gray-200 rounded-r-md bg-gray-50 text-gray-700 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {CURRENCY_OPTIONS.map(({ code, label }) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 mb-4">
            <label htmlFor="date" className="block mb-1 text-gray-700 font-medium text-sm">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="paidBy" className="block mb-1 text-gray-700 font-medium text-sm">
            Paid By
          </label>
          <select
            id="paidBy"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Select person...</option>
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">
            Split Type
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="equal"
                checked={splitType === 'equal'}
                onChange={() => setSplitType('equal')}
                name="splitType"
                className="cursor-pointer"
              />
              <span>Equal Split</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="custom"
                checked={splitType === 'custom'}
                onChange={() => setSplitType('custom')}
                name="splitType"
                className="cursor-pointer"
              />
              <span>Custom Split</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium text-sm">
            Split Between
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {people.map((person) => (
              <div key={person} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                <input
                  type="checkbox"
                  id={`split-${person}`}
                  checked={splitBetween.includes(person)}
                  onChange={() => handleSplitBetweenChange(person)}
                  className="cursor-pointer"
                />
                <label htmlFor={`split-${person}`} className="flex-1 cursor-pointer text-sm">
                  {person}
                </label>
                {splitType === 'custom' && splitBetween.includes(person) && (
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={customAmounts[person] || ''}
                    onChange={(e) => handleCustomAmountChange(person, e.target.value)}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {feedback && (
          <div className={`mb-4 text-sm ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback.message}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
