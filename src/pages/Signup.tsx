import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const session = useSession();
  const navigate = useNavigate();

  if (session) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Get Started</h1>
          <p className="text-gray-600 mb-8">Create your Grade Guru account</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <Auth
            supabaseClient={supabase}
            view="sign_up"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
            }}
            theme="light"
            providers={[]}
          />
          <div className="mt-4 text-sm text-gray-600">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Minimum 6 characters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;