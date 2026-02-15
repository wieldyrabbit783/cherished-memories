import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const close = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-heading text-xl font-bold text-primary" onClick={close}>
          MemoryLives
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Settings</Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild><Link to="/login">Login</Link></Button>
              <Button size="sm" asChild><Link to="/signup">Sign Up</Link></Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/" onClick={close} className="text-sm py-2">Home</Link>
            <Link to="/pricing" onClick={close} className="text-sm py-2">Pricing</Link>
            <Link to="/about" onClick={close} className="text-sm py-2">About</Link>
            <Link to="/contact" onClick={close} className="text-sm py-2">Contact</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={close} className="text-sm py-2">Dashboard</Link>
                <Link to="/settings" onClick={close} className="text-sm py-2">Settings</Link>
                <Button variant="outline" size="sm" onClick={() => { handleSignOut(); close(); }}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild><Link to="/login" onClick={close}>Login</Link></Button>
                <Button size="sm" asChild><Link to="/signup" onClick={close}>Sign Up</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
