import { Outlet } from 'react-router';
import { AdminNavbar } from './admin/AdminNavbar';
import { Toaster } from 'sonner';

export function AdminApp() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}
