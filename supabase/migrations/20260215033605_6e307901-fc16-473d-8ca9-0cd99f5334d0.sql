
-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Memorials table
CREATE TABLE public.memorials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  death_date DATE NOT NULL,
  location TEXT NOT NULL,
  biography TEXT NOT NULL,
  cover_image_url TEXT,
  video_url TEXT,
  tribute_message TEXT,
  slug TEXT NOT NULL UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.memorials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public memorials" ON public.memorials FOR SELECT USING (is_public = true);
CREATE POLICY "Owners can view own memorials" ON public.memorials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can insert memorials" ON public.memorials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update memorials" ON public.memorials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owners can delete memorials" ON public.memorials FOR DELETE USING (auth.uid() = user_id);

-- Memorial photos table
CREATE TABLE public.memorial_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.memorial_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view photos of public memorials" ON public.memorial_photos FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.memorials WHERE id = memorial_id AND (is_public = true OR user_id = auth.uid())));
CREATE POLICY "Owners can insert photos" ON public.memorial_photos FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.memorials WHERE id = memorial_id AND user_id = auth.uid()));
CREATE POLICY "Owners can delete photos" ON public.memorial_photos FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.memorials WHERE id = memorial_id AND user_id = auth.uid()));

-- Contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contacts" ON public.contacts FOR INSERT WITH CHECK (true);

-- Storage bucket for memorial images
INSERT INTO storage.buckets (id, name, public) VALUES ('memorial-images', 'memorial-images', true);
CREATE POLICY "Anyone can view memorial images" ON storage.objects FOR SELECT USING (bucket_id = 'memorial-images');
CREATE POLICY "Authenticated users can upload memorial images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'memorial-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own memorial images" ON storage.objects FOR DELETE USING (bucket_id = 'memorial-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_memorials_updated_at
  BEFORE UPDATE ON public.memorials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
