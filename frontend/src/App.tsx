import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { 
  Menu, X, Home, FileText, Image, Users, Settings, 
  Sun, Moon, Languages, ChevronDown, LogOut, User,
  Plus, Edit, Trash2, Eye, Search, Upload, Grid,
  List, ChevronLeft, ChevronRight, Check, AlertCircle
} from 'lucide-react';

// ==================== TYPES ====================
type Theme = 'light' | 'dark';
type Direction = 'ltr' | 'rtl';
type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'relation' | 'media';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ContentType {
  id: string;
  name: string;
  singularName: string;
  pluralName: string;
  fields: Field[];
}

interface Field {
  id: string;
  name: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  relation?: string;
}

interface ContentEntry {
  id: string;
  contentType: string;
  status: 'draft' | 'published';
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  contentTypes: ContentType[];
  entries: ContentEntry[];
}

interface UIState {
  theme: Theme;
  direction: Direction;
  sidebarOpen: boolean;
  loading: boolean;
  error: string | null;
}

// ==================== CONTEXT & REDUCERS ====================
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<any>;
} | null>(null);

const UIContext = createContext<{
  state: UIState;
  dispatch: React.Dispatch<any>;
} | null>(null);

function appReducer(state: AppState, action: any): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'SET_CONTENT_TYPES':
      return { ...state, contentTypes: action.payload };
    case 'ADD_CONTENT_TYPE':
      return { ...state, contentTypes: [...state.contentTypes, action.payload] };
    case 'UPDATE_CONTENT_TYPE':
      return {
        ...state,
        contentTypes: state.contentTypes.map(ct =>
          ct.id === action.payload.id ? action.payload : ct
        )
      };
    case 'DELETE_CONTENT_TYPE':
      return {
        ...state,
        contentTypes: state.contentTypes.filter(ct => ct.id !== action.payload)
      };
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload };
    case 'ADD_ENTRY':
      return { ...state, entries: [...state.entries, action.payload] };
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map(e =>
          e.id === action.payload.id ? action.payload : e
        )
      };
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(e => e.id !== action.payload)
      };
    default:
      return state;
  }
}

function uiReducer(state: UIState, action: any): UIState {
  switch (action.type) {
    case 'TOGGE_TLHEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_DIRECTION':
      return { ...state, direction: state.direction === 'ltr' ? 'rtl' : 'ltr' };
    case 'SET_DIRECTION':
      return { ...state, direction: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// ==================== PROVIDERS ====================
function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    isAuthenticated: false,
    contentTypes: [
      {
        id: '1',
        name: 'Article',
        singularName: 'article',
        pluralName: 'articles',
        fields: [
          { id: '1', name: 'title', type: 'text', required: true },
          { id: '2', name: 'content', type: 'textarea', required: true },
          { id: '3', name: 'published', type: 'boolean' }
        ]
      },
      {
        id: '2',
        name: 'Product',
        singularName: 'product',
        pluralName: 'products',
        fields: [
          { id: '1', name: 'name', type: 'text', required: true },
          { id: '2', name: 'price', type: 'number', required: true },
          { id: '3', name: 'description', type: 'textarea' }
        ]
      }
    ],
    entries: [
      {
        id: '1',
        contentType: 'article',
        status: 'published',
        data: { title: 'Getting Started', content: 'Welcome to our CMS', published: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        contentType: 'article',
        status: 'draft',
        data: { title: 'Draft Article', content: 'Work in progress', published: false },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

function UIProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, {
    theme: (localStorage.getItem('theme') as Theme) || 'light',
    direction: (localStorage.getItem('direction') as Direction) || 'ltr',
    sidebarOpen: true,
    loading: false,
    error: null
  });

  useEffect(() => {
    localStorage.setItem('theme', state.theme);
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  useEffect(() => {
    localStorage.setItem('direction', state.direction);
    document.documentElement.dir = state.direction;
  }, [state.direction]);

  return (
    <UIContext.Provider value={{ state, dispatch }}>
      {children}
    </UIContext.Provider>
  );
}

// ==================== HOOKS ====================
function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
}

// ==================== UI COMPONENTS ====================
function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: any) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ 
  label, 
  error, 
  className = '',
  ...props 
}: any) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

function Card({ children, className = '' }: any) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// ==================== LAYOUT COMPONENTS ====================
function Sidebar() {
  const { state: uiState } = useUI();
  const { state: appState } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'content-types', icon: FileText, label: 'Content Types' },
    { id: 'content-manager', icon: List, label: 'Content Manager' },
    { id: 'media', icon: Image, label: 'Media Library' },
    { id: 'roles', icon: Users, label: 'Roles & Permissions' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  if (!uiState.sidebarOpen) return null;

  return (
    <aside className="w-64 bg-gray-900 dark:bg-gray-950 text-white flex flex-col border-e border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">CMS Admin</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${currentPage === item.id 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            {appState.user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{appState.user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{appState.user?.role || 'Admin'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Header() {
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const { dispatch: appDispatch } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => uiDispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Dashboard</h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => uiDispatch({ type: 'TOGGLE_THEME' })}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Toggle theme"
        >
          {uiState.theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        <button
          onClick={() => uiDispatch({ type: 'TOGGLE_DIRECTION' })}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Toggle direction"
        >
          <Languages className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
            <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>

          {showUserMenu && (
            <div className="absolute end-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
              <button
                onClick={() => {
                  appDispatch({ type: 'LOGOUT' });
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ==================== PAGES ====================
function LoginPage({ onLogin }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onLogin({
      id: '1',
      name: 'Admin User',
      email,
      role: 'Administrator'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">CMS Admin</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="admin@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full" size="lg">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Dashboard() {
  const { state } = useApp();

  const stats = [
    {
      title: 'Total Entries',
      value: state.entries.length,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Published',
      value: state.entries.filter(e => e.status === 'published').length,
      icon: Check,
      color: 'bg-green-500'
    },
    {
      title: 'Drafts',
      value: state.entries.filter(e => e.status === 'draft').length,
      icon: Edit,
      color: 'bg-yellow-500'
    },
    {
      title: 'Content Types',
      value: state.contentTypes.length,
      icon: List,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {state.entries.slice(0, 5).map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {entry.data.title || entry.data.name || 'Untitled'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {entry.contentType}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                      ${entry.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(entry.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ContentTypeBuilder() {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ContentType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    singularName: '',
    pluralName: '',
    fields: [] as Field[]
  });

  const handleSave = () => {
    if (editingType) {
      dispatch({
        type: 'UPDATE_CONTENT_TYPE',
        payload: { ...editingType, ...formData }
      });
    } else {
      dispatch({
        type: 'ADD_CONTENT_TYPE',
        payload: {
          id: Date.now().toString(),
          ...formData
        }
      });
    }
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({ name: '', singularName: '', pluralName: '', fields: [] });
  };

  const addField = () => {
    setFormData({
      ...formData,
      fields: [
        ...formData.fields,
        { id: Date.now().toString(), name: '', type: 'text' }
      ]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Content Types</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your content structure</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 me-2" />
          New Content Type
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.contentTypes.map(type => (
          <Card key={type.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {type.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {type.fields.length} fields
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingType(type);
                  setFormData(type);
                  setIsModalOpen(true);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="space-y-2">
              {type.fields.map(field => (
                <div key={field.id} className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">{field.name}</span>
                  <span className="text-gray-500 dark:text-gray-500">({field.type})</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingType ? 'Edit Content Type' : 'New Content Type'}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Article"
          />
          <Input
            label="Singular Name"
            value={formData.singularName}
            onChange={(e: any) => setFormData({ ...formData, singularName: e.target.value })}
            placeholder="article"
          />
          <Input
            label="Plural Name"
            value={formData.pluralName}
            onChange={(e: any) => setFormData({ ...formData, pluralName: e.target.value })}
            placeholder="articles"
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fields</label>
              <Button size="sm" variant="secondary" onClick={addField}>
                <Plus className="w-4 h-4 me-1" />
                Add Field
              </Button>
            </div>
            <div className="space-y-3">
              {formData.fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    placeholder="Field name"
                    value={field.name}
                    onChange={(e: any) => {
                      const newFields = [...formData.fields];
                      newFields[idx].name = e.target.value;
                      setFormData({ ...formData, fields: newFields });
                    }}
                  />
                  <select
                    value={field.type}
                    onChange={(e: any) => {
                      const newFields = [...formData.fields];
                      newFields[idx].type = e.target.value;
                      setFormData({ ...formData, fields: newFields });
                    }}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="select">Select</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">Save</Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ==================== MAIN APP ====================
function App() {
  const { state: appState, dispatch: appDispatch } = useApp();

  if (!appState.isAuthenticated) {
    return (
      <LoginPage
        onLogin={(user: User) => appDispatch({ type: 'LOGIN', payload: user })}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <UIProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </UIProvider>
  );
}