import { Link, useLocation } from "react-router";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 font-bold text-base sm:text-lg hover:opacity-80 transition-opacity">
            <Calendar className="size-5 sm:size-6" />
            <span className="hidden min-[400px]:inline">EventiCampania</span>
            <span className="min-[400px]:hidden">EC</span>
          </Link>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/events"
              className={cn(
                "text-sm sm:text-base font-medium transition-colors hover:text-primary px-2 py-1 rounded-md",
                isActive("/events")
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              )}
            >
              Eventi
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
