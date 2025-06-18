
import { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';

const Dashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar 
        expanded={sidebarExpanded} 
        setExpanded={setSidebarExpanded}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
