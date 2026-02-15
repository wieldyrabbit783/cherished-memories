import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t bg-secondary/30 py-12">
    <div className="container">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-primary mb-3">MemoryLives</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Preserving memories of loved ones with dignity and beauty.
          </p>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold mb-3">Company</h4>
          <nav className="flex flex-col gap-2">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </nav>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold mb-3">Legal</h4>
          <nav className="flex flex-col gap-2">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </nav>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold mb-3">Account</h4>
          <nav className="flex flex-col gap-2">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link>
          </nav>
        </div>
      </div>
      <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} MemoryLives. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
