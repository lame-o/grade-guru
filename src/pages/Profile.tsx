import { useSession } from '@supabase/auth-helpers-react';

export default function Profile() {
  const session = useSession();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Email</h2>
            <p className="text-gray-600">{session?.user?.email}</p>
          </div>
          {/* Add more profile information as needed */}
        </div>
      </div>
    </div>
  );
}