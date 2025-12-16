import Sidebar from './Sidebar';
import Header from './Header';
import { useUI } from '../context/UIContext';

import Dashboard from '../pages/Dashboard';
import ContentTypeBuilder from '../pages/ContentTypeBuilder';
import MediaLibrary from '../pages/MediaLibrary';
import Settings from '../pages/Settings';

export default function MainLayout() {
  const { state } = useUI();

  const renderPage = () => {
    switch (state.currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'content-types':
        return <ContentTypeBuilder />;
      case 'media':
        return <MediaLibrary />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
