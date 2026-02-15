import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shirt, Coffee, Frame, Palette, Image as ImageIcon, Eye, ShoppingBag } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  tshirt: <Shirt className="h-16 w-16" />,
  mug: <Coffee className="h-16 w-16" />,
  frame: <Frame className="h-16 w-16" />,
  hoodie: <Shirt className="h-16 w-16" />,
  canvas: <ImageIcon className="h-16 w-16" />,
  artwork: <Palette className="h-16 w-16" />,
};

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
}

interface Memorial {
  id: string;
  full_name: string;
  birth_date: string;
  death_date: string;
  cover_image_url: string | null;
  tribute_message: string | null;
}

interface MemorialPhoto {
  id: string;
  photo_url: string;
}

const CustomizeProduct = () => {
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [photos, setPhotos] = useState<MemorialPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMemorial, setSelectedMemorial] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [customText, setCustomText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Shipping
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');

  useEffect(() => {
    if (!user || !productId) return;
    Promise.all([
      supabase.from('store_products').select('*').eq('id', productId).single(),
      supabase.from('memorials').select('id, full_name, birth_date, death_date, cover_image_url, tribute_message').eq('user_id', user.id),
    ]).then(([productRes, memorialsRes]) => {
      setProduct(productRes.data as Product | null);
      setMemorials((memorialsRes.data as Memorial[]) || []);
      setLoading(false);
    });
  }, [user, productId]);

  // Load photos when memorial changes
  useEffect(() => {
    if (!selectedMemorial) { setPhotos([]); return; }
    supabase
      .from('memorial_photos')
      .select('id, photo_url')
      .eq('memorial_id', selectedMemorial)
      .then(({ data }) => setPhotos((data as MemorialPhoto[]) || []));

    const mem = memorials.find((m) => m.id === selectedMemorial);
    if (mem) {
      const dates = `${mem.birth_date} — ${mem.death_date}`;
      setCustomText(`In Loving Memory of ${mem.full_name}\n${dates}${mem.tribute_message ? `\n"${mem.tribute_message}"` : ''}`);
      if (mem.cover_image_url) setSelectedPhoto(mem.cover_image_url);
    }
  }, [selectedMemorial, memorials]);

  const handleOrder = async () => {
    if (!product || !user) return;
    if (!shippingName || !shippingAddress || !shippingCity || !shippingState || !shippingZip) {
      toast({ title: 'Missing info', description: 'Please fill in all shipping fields.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('orders').insert([{
      user_id: user.id,
      memorial_id: selectedMemorial || null,
      product_id: product.id,
      product_name: product.name,
      custom_text: customText,
      custom_photo_url: selectedPhoto || null,
      quantity: 1,
      unit_price: product.base_price,
      total_price: product.base_price,
      shipping_name: shippingName,
      shipping_address: shippingAddress,
      shipping_city: shippingCity,
      shipping_state: shippingState,
      shipping_zip: shippingZip,
    }]);
    setSubmitting(false);

    if (error) {
      toast({ title: 'Order failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Order placed!', description: 'Your keepsake order has been submitted. We\'ll be in touch about fulfillment.' });
      navigate('/dashboard');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const chosenPhoto = selectedPhoto;

  return (
    <div className="container max-w-5xl py-12">
      <h1 className="font-heading text-3xl font-bold">Customize Your Keepsake</h1>
      <p className="mt-2 text-muted-foreground">Personalize <span className="font-semibold text-foreground">{product.name}</span> with a photo and meaningful text.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {/* Left: Customization form */}
        <div className="space-y-6">
          {/* Memorial selection */}
          {memorials.length > 0 && (
            <div className="space-y-2">
              <Label>Select a Memorial</Label>
              <Select value={selectedMemorial} onValueChange={setSelectedMemorial}>
                <SelectTrigger><SelectValue placeholder="Choose a memorial…" /></SelectTrigger>
                <SelectContent>
                  {memorials.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Photo selection */}
          {(photos.length > 0 || memorials.find(m => m.id === selectedMemorial)?.cover_image_url) && (
            <div className="space-y-2">
              <Label>Choose a Photo</Label>
              <div className="grid grid-cols-3 gap-3">
                {memorials.find(m => m.id === selectedMemorial)?.cover_image_url && (
                  <button
                    onClick={() => setSelectedPhoto(memorials.find(m => m.id === selectedMemorial)!.cover_image_url!)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${selectedPhoto === memorials.find(m => m.id === selectedMemorial)!.cover_image_url ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                  >
                    <img src={memorials.find(m => m.id === selectedMemorial)!.cover_image_url!} alt="Cover" className="h-full w-full object-cover" />
                  </button>
                )}
                {photos.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPhoto(p.photo_url)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${selectedPhoto === p.photo_url ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                  >
                    <img src={p.photo_url} alt="Memorial" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom text */}
          <div className="space-y-2">
            <Label>Custom Text</Label>
            <Textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="In Loving Memory of…"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">Add a name, dates, quote, or personal message.</p>
          </div>

          <Button variant="outline" className="w-full" onClick={() => setShowPreview(true)}>
            <Eye className="mr-2 h-4 w-4" /> Preview Design
          </Button>

          {/* Shipping */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Shipping Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Full Name</Label><Input value={shippingName} onChange={e => setShippingName(e.target.value)} placeholder="John Doe" /></div>
              <div><Label>Address</Label><Input value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} placeholder="123 Main St" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>City</Label><Input value={shippingCity} onChange={e => setShippingCity(e.target.value)} /></div>
                <div><Label>State</Label><Input value={shippingState} onChange={e => setShippingState(e.target.value)} /></div>
                <div><Label>ZIP</Label><Input value={shippingZip} onChange={e => setShippingZip(e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg" onClick={handleOrder} disabled={submitting}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            {submitting ? 'Placing Order…' : `Order Keepsake — $${product.base_price.toFixed(2)}`}
          </Button>
        </div>

        {/* Right: Live preview */}
        <div className="sticky top-24">
          <Card className="overflow-hidden" style={{ boxShadow: 'var(--shadow-warm)' }}>
            <div className="bg-secondary/30 p-6 text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Live Preview</p>
              <h3 className="mt-1 font-heading text-lg font-semibold">{product.name}</h3>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-6">
                {/* Product icon / photo */}
                <div className="relative flex h-56 w-full items-center justify-center rounded-xl bg-secondary/20">
                  {chosenPhoto ? (
                    <img src={chosenPhoto} alt="Preview" className="h-full w-full rounded-xl object-contain" />
                  ) : (
                    <div className="text-primary/40">
                      {categoryIcons[product.category] || <ShoppingBag className="h-16 w-16" />}
                    </div>
                  )}
                </div>
                {/* Text preview */}
                {customText && (
                  <div className="w-full rounded-lg bg-secondary/20 p-4 text-center">
                    {customText.split('\n').map((line, i) => (
                      <p key={i} className={i === 0 ? 'font-heading text-lg font-semibold' : 'text-sm text-muted-foreground'}>
                        {line}
                      </p>
                    ))}
                  </div>
                )}
                <p className="font-heading text-2xl font-bold text-primary">${product.base_price.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowPreview(false)}>
          <div className="mx-4 max-w-lg rounded-2xl bg-card p-8 shadow-xl" onClick={e => e.stopPropagation()} style={{ boxShadow: 'var(--shadow-warm)' }}>
            <h2 className="font-heading text-2xl font-bold text-center">Design Preview</h2>
            <div className="mt-6 flex flex-col items-center gap-4">
              {chosenPhoto ? (
                <img src={chosenPhoto} alt="Preview" className="h-64 w-64 rounded-xl object-cover" />
              ) : (
                <div className="flex h-64 w-64 items-center justify-center rounded-xl bg-secondary/30 text-primary/40">
                  {categoryIcons[product.category]}
                </div>
              )}
              {customText && (
                <div className="text-center">
                  {customText.split('\n').map((line, i) => (
                    <p key={i} className={i === 0 ? 'font-heading text-xl font-semibold' : 'text-muted-foreground'}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground">{product.name} — ${product.base_price.toFixed(2)}</p>
            </div>
            <Button className="mt-6 w-full" onClick={() => setShowPreview(false)}>Close Preview</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizeProduct;
