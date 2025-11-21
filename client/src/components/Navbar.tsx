import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";// Avatar fallback is simple text

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b bg-white px-6 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl tracking-tight">StoreRating</span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600 border">
          {user?.role}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium leading-none">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}