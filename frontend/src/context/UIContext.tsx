type Page =
  | 'dashboard'
  | 'content-types'
  | 'content-manager'
  | 'media'
  | 'roles'
  | 'settings';

interface UIState {
  theme: Theme;
  direction: Direction;
  sidebarOpen: boolean;
  loading: boolean;
  error: string | null;
  currentPage: Page;
}
const initialUIState: UIState = {
  theme: 'light',
  direction: 'ltr',
  sidebarOpen: true,
  loading: false,
  error: null,
  currentPage: 'dashboard',
};

case 'SET_PAGE':
  return { ...state, currentPage: action.payload };
