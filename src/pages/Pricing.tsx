import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const Pricing = () => (
  <div className="py-16 lg:py-24">
    <div className="container max-w-3xl text-center">
      <h1 className="font-heading text-4xl font-bold">Simple, Honest Pricing</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Start preserving memories today — completely free.
      </p>

      <div className="mx-auto mt-12 max-w-sm rounded-2xl border bg-card p-8" style={{ boxShadow: 'var(--shadow-warm)' }}>
        <h2 className="font-heading text-2xl font-semibold">Free Plan</h2>
        <p className="mt-1 text-4xl font-bold text-primary">$0</p>
        <p className="text-sm text-muted-foreground">Forever free</p>

        <ul className="mt-8 space-y-3 text-left text-sm">
          {[
            'Create memorial pages',
            'Upload photos & cover images',
            'Shareable public links',
            'Biography & tribute messages',
            'Secure account',
          ].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Button size="lg" asChild className="mt-8 w-full">
          <Link to="/signup">Get Started Free</Link>
        </Button>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Premium plans with advanced features are coming soon. Stay tuned!
      </p>
    </div>
  </div>
);

export default Pricing;
