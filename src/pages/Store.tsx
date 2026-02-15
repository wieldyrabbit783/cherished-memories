import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Shirt, Coffee, Frame, Palette, Image as ImageIcon } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  tshirt: <Shirt className="h-10 w-10" />,
  mug: <Coffee className="h-10 w-10" />,
  frame: <Frame className="h-10 w-10" />,
  hoodie: <Shirt className="h-10 w-10" />,
  canvas: <ImageIcon className="h-10 w-10" />,
  artwork: <Palette className="h-10 w-10" />,
};

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  image_url: string | null;
}

const Store = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('store_products')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => {
        setProducts((data as Product[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="py-20 lg:py-28 text-center" style={{ background: 'var(--warm-gradient)' }}>
        <div className="container">
          <ShoppingBag className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">
            Memorial Keepsake Store
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Turn cherished memories into beautiful, personalized keepsakes you can wear, hold, or display forever.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="container">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className="group overflow-hidden transition-shadow hover:shadow-lg" style={{ boxShadow: 'var(--shadow-soft)' }}>
                  <div className="flex h-48 items-center justify-center bg-secondary/30 text-primary transition-colors group-hover:bg-secondary/50">
                    {categoryIcons[product.category] || <ShoppingBag className="h-10 w-10" />}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-xl font-semibold">{product.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-heading text-2xl font-bold text-primary">
                        ${product.base_price.toFixed(2)}
                      </span>
                      <Button asChild size="sm">
                        <Link to={`/store/customize/${product.id}`}>Create Keepsake</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Emotional CTA */}
      <section className="bg-secondary/40 py-16">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-semibold">Keep Their Memory Close</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Every keepsake is crafted with love, designed to honor the people who meant the most.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Store;
