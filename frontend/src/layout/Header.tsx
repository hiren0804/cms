import { Menu, Sun, Moon, Languages } from 'lucide-react';
import { useUI } from '../context/UIContext';

export default function Header() {
  const { state, dispatch } = useUI();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b px-6 flex justify-between items-center">
      <button
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Menu />
      </button>

      <div className="flex gap-3">
        <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
          {state.theme === 'light' ? <Moon /> : <Sun />}
        </button>

        <button onClick={() => dispatch({ type: 'TOGGLE_DIRECTION' })}>
          <Languages />
        </button>
      </div>
    </header>
  );
}
