import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';

import { Navbar } from '../components/Navbar';

export function DashboardLayout(): JSX.Element {
  return (
    <div className="dashboard-layout-container">
      <Navbar />
      <main className="dashboard-main-content">
        <div className="dashboard-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
