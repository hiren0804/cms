import { Home, FileText, Image, Users, Settings, List } from 'lucide-react';
import { useUI } from '../context/UIContext';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'content-types', icon: FileText, label: 'Content Types' },
  { id: 'content-manager', icon: List, label: 'Content Manager' },
  { id: 'media', icon: Image, label: 'Media Library' },
  { id: 'roles', icon: Users, label: 'Roles & Permissions' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { state, dispatch } = useUI();

  if (!state.sidebarOpen) return null;

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800 text-xl font-bold">
        CMS Admin
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() =>
              dispatch({ type: 'SET_PAGE', payload: item.id })
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg
              ${
                state.currentPage === item.id
                  ? 'bg-blue-600'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
