import { useState, useEffect } from 'react';
import BalanceView from './components/BalanceView';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import PeopleManager from './components/PeopleManager';
import ToggleButton from './components/ToggleButton';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <header className="bg-white/10 backdrop-blur-md p-6 border-b border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-white text-3xl sm:text-4xl font-bold drop-shadow-lg">💰 Expense Splitter</h1>
        <ToggleButton isDark={isDark} toggleTheme={toggleTheme} />
      </header>

      <main className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-1/2 space-y-6">
            <PeopleManager />
            <ExpenseForm />
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <BalanceView />
            <ExpenseList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
