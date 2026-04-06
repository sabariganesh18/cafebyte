import { Outlet } from 'react-router';
import { UserNavbar } from './user/UserNavbar';
import { Toaster } from 'sonner';

export function UserApp() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UserNavbar />
      <main className="pb-20">
        <Outlet />
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}
