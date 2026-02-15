
-- Store products catalog
CREATE TABLE public.store_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'tshirt', 'mug', 'frame', 'hoodie', 'canvas', 'artwork'
  base_price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON public.store_products FOR SELECT
  USING (is_active = true);

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  memorial_id UUID REFERENCES public.memorials(id),
  product_id UUID REFERENCES public.store_products(id),
  product_name TEXT NOT NULL,
  custom_text TEXT,
  custom_photo_url TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered'
  shipping_name TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_zip TEXT,
  shipping_country TEXT DEFAULT 'US',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Seed default products
INSERT INTO public.store_products (name, description, category, base_price) VALUES
  ('Memorial T-Shirt', 'Premium cotton T-shirt with your loved one''s photo and a meaningful quote. Soft, comfortable, and made to last.', 'tshirt', 34.99),
  ('Remembrance Mug', 'A beautiful ceramic mug featuring a custom photo and personal message. Perfect for morning reflections.', 'mug', 24.99),
  ('Framed Memorial Photo', 'An elegant framed print with your chosen photo, name, dates, and a heartfelt tribute. Museum-quality paper.', 'frame', 49.99),
  ('Memorial Hoodie', 'A cozy premium hoodie with a custom photo and quote. Keep their memory close on cooler days.', 'hoodie', 54.99),
  ('Canvas Memorial Print', 'Gallery-wrapped canvas print featuring a beautiful memorial design. Ready to hang and treasure forever.', 'canvas', 69.99),
  ('Custom Memorial Artwork', 'A one-of-a-kind artistic rendition of your loved one''s photo, blended with meaningful text and design elements.', 'artwork', 89.99);

-- Trigger for updated_at on orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
