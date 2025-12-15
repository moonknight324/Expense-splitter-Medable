import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addPerson, removePerson } from '../slices/peopleSlice';

function PeopleManager() {
  const dispatch = useDispatch();
  const people = useSelector((state: RootState) => state.people.people);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const [newName, setNewName] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();

    if (!trimmedName) {
      setFeedback({ type: 'error', message: 'Name cannot be empty' });
      return;
    }

    const nameExists = people.some(p => p.toLowerCase() === trimmedName.toLowerCase());
    if (nameExists) {
      setFeedback({ type: 'error', message: 'Person already exists' });
      return;
    }

    dispatch(addPerson(trimmedName));
    setNewName('');
    setFeedback({ type: 'success', message: `Added ${trimmedName} successfully` });
    
    // Clear success message after 3 seconds
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRemovePerson = (person: string) => {
    if (people.length <= 2) {
      setFeedback({ type: 'error', message: 'Cannot remove person. Minimum 2 people required.' });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const hasExpenses = expenses.some(e => e.paidBy === person || e.splitBetween.includes(person));
    if (hasExpenses) {
      setFeedback({ type: 'error', message: 'Cannot remove person involved in expenses.' });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    dispatch(removePerson(person));
    setFeedback({ type: 'success', message: `Removed ${person}` });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        👥 Manage People
      </h2>

      <form onSubmit={handleAddPerson} className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter person's name"
          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-indigo-600 hover:-translate-y-px"
        >
          Add Person
        </button>
      </form>

      {feedback && (
        <div className={`mb-4 text-sm ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {feedback.message}
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-gray-600 my-2 text-lg">
          Current Members ({people.length})
        </h3>
        {people.length === 0 ? (
          <p className="text-center text-gray-400 py-8 italic">
            No people added yet
          </p>
        ) : (
          <ul className="list-none mt-2">
            {people.map((person, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 mb-1 bg-gray-50 rounded transition-colors hover:bg-gray-100"
              >
                <span className="font-medium text-gray-800">{person}</span>
                <button 
                  onClick={() => handleRemovePerson(person)}
                  className="bg-transparent text-red-500 px-1 py-1 text-sm border border-transparent transition-colors hover:bg-red-100 hover:border-red-300 rounded"
                  aria-label={`Remove ${person}`}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {people.length < 2 && (
        <p className="bg-red-100 text-red-900 px-3 py-3 rounded-md mt-4 flex items-center gap-2">
          ⚠️ Add at least 2 people to start tracking expenses
        </p>
      )}
    </div>
  );
}

export default PeopleManager;
