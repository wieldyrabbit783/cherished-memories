import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const memorialSchema = z.object({
  full_name: z.string().trim().min(1, 'Name is required').max(200),
  birth_date: z.string().min(1, 'Birth date is required'),
  death_date: z.string().min(1, 'Death date is required'),
  location: z.string().trim().min(1, 'Location is required').max(300),
  biography: z.string().trim().min(1, 'Biography is required').max(10000),
  video_url: z.string().url().optional().or(z.literal('')),
  tribute_message: z.string().max(5000).optional(),
});

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CreateMemorial = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    full_name: '', birth_date: '', death_date: '', location: '',
    biography: '', video_url: '', tribute_message: '',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!user) return;

    const result = memorialSchema.safeParse(form);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) fe[err.path[0] as string] = err.message; });
      setErrors(fe);
      return;
    }

    if (!coverFile) {
      setErrors({ cover: 'Cover image is required' });
      return;
    }

    setLoading(true);

    // Generate unique slug
    let slug = slugify(form.full_name);
    const { data: existing } = await supabase
      .from('memorials')
      .select('slug')
      .like('slug', `${slug}%`);
    if (existing && existing.length > 0) {
      slug = `${slug}-${existing.length + 1}`;
    }

    // Upload cover image
    const coverPath = `${user.id}/${slug}/cover-${Date.now()}.${coverFile.name.split('.').pop()}`;
    const { error: coverErr } = await supabase.storage.from('memorial-images').upload(coverPath, coverFile);
    if (coverErr) {
      toast({ title: 'Upload error', description: coverErr.message, variant: 'destructive' });
      setLoading(false);
      return;
    }
    const { data: coverUrl } = supabase.storage.from('memorial-images').getPublicUrl(coverPath);

    // Insert memorial
    const { data: memorial, error: insertErr } = await supabase
      .from('memorials')
      .insert({
        user_id: user.id,
        full_name: result.data.full_name,
        birth_date: result.data.birth_date,
        death_date: result.data.death_date,
        location: result.data.location,
        biography: result.data.biography,
        cover_image_url: coverUrl.publicUrl,
        video_url: result.data.video_url || null,
        tribute_message: result.data.tribute_message || null,
        slug,
      })
      .select('id')
      .single();

    if (insertErr || !memorial) {
      toast({ title: 'Error', description: insertErr?.message || 'Failed to create memorial.', variant: 'destructive' });
      setLoading(false);
      return;
    }

    // Upload additional photos
    for (const file of photoFiles) {
      const path = `${user.id}/${slug}/photo-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
      const { error: photoErr } = await supabase.storage.from('memorial-images').upload(path, file);
      if (!photoErr) {
        const { data: photoUrl } = supabase.storage.from('memorial-images').getPublicUrl(path);
        await supabase.from('memorial_photos').insert({ memorial_id: memorial.id, photo_url: photoUrl.publicUrl });
      }
    }

    setLoading(false);
    toast({ title: 'Memorial created', description: 'Your memorial page is now live.' });
    navigate('/dashboard');
  };

  return (
    <div className="py-12">
      <div className="container max-w-2xl">
        <h1 className="font-heading text-3xl font-bold">Create Memorial</h1>
        <p className="mt-2 text-muted-foreground">Honor your loved one with a beautiful memorial page.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input id="full_name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} placeholder="Full name of your loved one" />
            {errors.full_name && <p className="mt-1 text-sm text-destructive">{errors.full_name}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="birth_date">Birth Date *</Label>
              <Input id="birth_date" type="date" value={form.birth_date} onChange={(e) => update('birth_date', e.target.value)} />
              {errors.birth_date && <p className="mt-1 text-sm text-destructive">{errors.birth_date}</p>}
            </div>
            <div>
              <Label htmlFor="death_date">Death Date *</Label>
              <Input id="death_date" type="date" value={form.death_date} onChange={(e) => update('death_date', e.target.value)} />
              {errors.death_date && <p className="mt-1 text-sm text-destructive">{errors.death_date}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input id="location" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="City, State or Country" />
            {errors.location && <p className="mt-1 text-sm text-destructive">{errors.location}</p>}
          </div>
          <div>
            <Label htmlFor="biography">Biography *</Label>
            <Textarea id="biography" rows={6} value={form.biography} onChange={(e) => update('biography', e.target.value)} placeholder="Share their story…" />
            {errors.biography && <p className="mt-1 text-sm text-destructive">{errors.biography}</p>}
          </div>
          <div>
            <Label htmlFor="cover">Cover Image *</Label>
            <Input id="cover" type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
            {errors.cover && <p className="mt-1 text-sm text-destructive">{errors.cover}</p>}
          </div>
          <div>
            <Label htmlFor="photos">Additional Photos</Label>
            <Input id="photos" type="file" accept="image/*" multiple onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))} />
          </div>
          <div>
            <Label htmlFor="video_url">Video URL (optional)</Label>
            <Input id="video_url" value={form.video_url} onChange={(e) => update('video_url', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            {errors.video_url && <p className="mt-1 text-sm text-destructive">{errors.video_url}</p>}
          </div>
          <div>
            <Label htmlFor="tribute_message">Tribute Message (optional)</Label>
            <Textarea id="tribute_message" rows={3} value={form.tribute_message} onChange={(e) => update('tribute_message', e.target.value)} placeholder="A special message…" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating…' : 'Create Memorial'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateMemorial;
