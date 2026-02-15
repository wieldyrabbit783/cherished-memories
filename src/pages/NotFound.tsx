import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
    <h1 className="font-heading text-6xl font-bold text-primary">404</h1>
    <p className="mt-4 text-xl text-muted-foreground">The page you're looking for doesn't exist.</p>
    <Button asChild className="mt-8">
      <Link to="/">Back to Home</Link>
    </Button>
  </div>
);

export default NotFound;
