import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface MemorialData {
  id: string;
  full_name: string;
  birth_date: string;
  death_date: string;
  location: string;
  biography: string;
  cover_image_url: string | null;
  video_url: string | null;
  tribute_message: string | null;
  slug: string;
}

interface Photo {
  id: string;
  photo_url: string;
}

const EditMemorial = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [memorial, setMemorial] = useState<MemorialData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [form, setForm] = useState({
    full_name: '', birth_date: '', death_date: '', location: '',
    biography: '', video_url: '', tribute_message: '',
  });
  const [newCover, setNewCover] = useState<File | null>(null);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    const fetch = async () => {
      const { data: m } = await supabase
        .from('memorials')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      if (!m) { navigate('/dashboard'); return; }
      setMemorial(m);
      setForm({
        full_name: m.full_name,
        birth_date: m.birth_date,
        death_date: m.death_date,
        location: m.location,
        biography: m.biography,
        video_url: m.video_url || '',
        tribute_message: m.tribute_message || '',
      });

      const { data: p } = await supabase
        .from('memorial_photos')
        .select('id, photo_url')
        .eq('memorial_id', id);
      setPhotos(p || []);
      setLoading(false);
    };
    fetch();
  }, [id, user]);

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const removePhoto = async (photoId: string, url: string) => {
    try {
      const path = new URL(url).pathname.split('/storage/v1/object/public/memorial-images/')[1];
      if (path) await supabase.storage.from('memorial-images').remove([path]);
    } catch {}
    await supabase.from('memorial_photos').delete().eq('id', photoId);
    setPhotos(photos.filter((p) => p.id !== photoId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memorial || !user) return;
    setSaving(true);

    let coverUrl = memorial.cover_image_url;

    if (newCover) {
      const coverPath = `${user.id}/${memorial.slug}/cover-${Date.now()}.${newCover.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('memorial-images').upload(coverPath, newCover);
      if (!error) {
        const { data } = supabase.storage.from('memorial-images').getPublicUrl(coverPath);
        coverUrl = data.publicUrl;
      }
    }

    await supabase.from('memorials').update({
      full_name: form.full_name,
      birth_date: form.birth_date,
      death_date: form.death_date,
      location: form.location,
      biography: form.biography,
      cover_image_url: coverUrl,
      video_url: form.video_url || null,
      tribute_message: form.tribute_message || null,
    }).eq('id', memorial.id);

    // Upload new photos
    for (const file of newPhotos) {
      const path = `${user.id}/${memorial.slug}/photo-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('memorial-images').upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from('memorial-images').getPublicUrl(path);
        await supabase.from('memorial_photos').insert({ memorial_id: memorial.id, photo_url: data.publicUrl });
      }
    }

    setSaving(false);
    toast({ title: 'Saved', description: 'Memorial updated successfully.' });
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container max-w-2xl">
        <h1 className="font-heading text-3xl font-bold">Edit Memorial</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="birth_date">Birth Date</Label>
              <Input id="birth_date" type="date" value={form.birth_date} onChange={(e) => update('birth_date', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="death_date">Death Date</Label>
              <Input id="death_date" type="date" value={form.death_date} onChange={(e) => update('death_date', e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={form.location} onChange={(e) => update('location', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="biography">Biography</Label>
            <Textarea id="biography" rows={6} value={form.biography} onChange={(e) => update('biography', e.target.value)} />
          </div>

          {memorial?.cover_image_url && (
            <div>
              <Label>Current Cover</Label>
              <img src={memorial.cover_image_url} alt="Cover" className="mt-1 h-40 w-full rounded-lg object-cover" />
            </div>
          )}
          <div>
            <Label htmlFor="newCover">Replace Cover Image</Label>
            <Input id="newCover" type="file" accept="image/*" onChange={(e) => setNewCover(e.target.files?.[0] || null)} />
          </div>

          {photos.length > 0 && (
            <div>
              <Label>Gallery Photos</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {photos.map((p) => (
                  <div key={p.id} className="group relative">
                    <img src={p.photo_url} alt="" className="h-24 w-full rounded-md object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(p.id, p.photo_url)}
                      className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="newPhotos">Add More Photos</Label>
            <Input id="newPhotos" type="file" accept="image/*" multiple onChange={(e) => setNewPhotos(Array.from(e.target.files || []))} />
          </div>

          <div>
            <Label htmlFor="video_url">Video URL</Label>
            <Input id="video_url" value={form.video_url} onChange={(e) => update('video_url', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="tribute_message">Tribute Message</Label>
            <Textarea id="tribute_message" rows={3} value={form.tribute_message} onChange={(e) => update('tribute_message', e.target.value)} />
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditMemorial;
