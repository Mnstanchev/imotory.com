import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  if (session.user.role === 'ADMIN' || session.user.role === 'SUPERADMIN') {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Welcome, {session.user.email}!</h2>
            <a 
              href="/api/auth/signout-force"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Logout
            </a>
          </div>
          <p className="text-gray-600 mb-4">Role: {session.user.role}</p>
          <p className="text-gray-600">This is your user dashboard. Admin access is required to access the admin panel.</p>
        </div>
      </div>
    </div>
  );
}