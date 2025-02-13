import { Button } from "@/components/ui/button";
import { LogOut, HelpCircle, User, Grid } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { cn } from "@/lib/utils";

export const NavigationHeader = () => {
  const navigate = useNavigate();
  const session = useSession();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  const isActiveRoute = (path: string) => {
    if (path === "/dashboard") {
      // Only match exact dashboard path or root dashboard path
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname === path;
  };

  const isInClassView = location.pathname.includes("/dashboard/class/");
  const isAddingClass = location.pathname === "/dashboard/new";

  const navigationItems = [
    { 
      path: "/dashboard", 
      label: isInClassView || isAddingClass ? "Back to Dashboard" : "Dashboard", 
      icon: Grid,
      show: true
    },
    { path: "/help", label: "Help", icon: HelpCircle, show: true },
    { path: "/profile", label: "Profile", icon: User, show: true }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex justify-between items-center">
          <Link 
            to={session ? "/dashboard" : "/"} 
            className="flex items-center space-x-2"
          >
            <h1 className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
              Grade Guru
            </h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {navigationItems.map((item) => item.show && (
                  <Button
                    key={item.path}
                    variant={isActiveRoute(item.path) ? "default" : "ghost"}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "transition-colors flex items-center gap-2",
                      (isInClassView || isAddingClass) && item.path === "/dashboard" && "bg-secondary hover:bg-secondary/90"
                    )}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </Button>
                ))}
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={isActiveRoute("/login") ? "default" : "ghost"}
                  onClick={() => navigate("/login")}
                  className="transition-colors"
                >
                  Login
                </Button>
                <Button
                  variant={isActiveRoute("/signup") ? "default" : "ghost"}
                  onClick={() => navigate("/signup")}
                  className="transition-colors"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};