import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Calendar } from 'lucide-react';

interface MemorialData {
  full_name: string;
  birth_date: string;
  death_date: string;
  location: string;
  biography: string;
  cover_image_url: string | null;
  video_url: string | null;
  tribute_message: string | null;
}

interface Photo {
  id: string;
  photo_url: string;
}

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      return v ? `https://www.youtube.com/embed/${v}` : null;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
  } catch {}
  return null;
};

const MemorialPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [memorial, setMemorial] = useState<MemorialData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      const { data: m } = await supabase
        .from('memorials')
        .select('id, full_name, birth_date, death_date, location, biography, cover_image_url, video_url, tribute_message')
        .eq('slug', slug)
        .single();
      if (!m) { setNotFound(true); setLoading(false); return; }
      setMemorial(m);

      const { data: p } = await supabase
        .from('memorial_photos')
        .select('id, photo_url')
        .eq('memorial_id', (m as any).id);
      setPhotos(p || []);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (notFound || !memorial) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="font-heading text-3xl font-bold">Memorial Not Found</h1>
        <p className="mt-3 text-muted-foreground">This memorial page doesn't exist or has been removed.</p>
        <Link to="/" className="mt-6 text-primary hover:underline">Back to Home</Link>
      </div>
    );
  }

  const embedUrl = memorial.video_url ? getYouTubeEmbedUrl(memorial.video_url) : null;

  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 bg-muted sm:h-96">
        {memorial.cover_image_url && (
          <img src={memorial.cover_image_url} alt={memorial.full_name} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <h1 className="font-heading text-3xl font-bold text-primary-foreground sm:text-5xl drop-shadow-lg">
            {memorial.full_name}
          </h1>
        </div>
      </div>

      <div className="container max-w-3xl py-10">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {memorial.birth_date} — {memorial.death_date}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {memorial.location}
          </span>
        </div>

        {/* Biography */}
        <div className="mt-8">
          <h2 className="font-heading text-2xl font-semibold">Biography</h2>
          <div className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
            {memorial.biography}
          </div>
        </div>

        {/* Tribute */}
        {memorial.tribute_message && (
          <div className="mt-10 rounded-xl bg-secondary/50 p-6 text-center italic">
            <p className="text-lg text-foreground leading-relaxed">"{memorial.tribute_message}"</p>
          </div>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div className="mt-10">
            <h2 className="font-heading text-2xl font-semibold">Photo Gallery</h2>
            <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3">
              {photos.map((p) => (
                <img
                  key={p.id}
                  src={p.photo_url}
                  alt=""
                  className="h-40 w-full rounded-lg object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {embedUrl && (
          <div className="mt-10">
            <h2 className="font-heading text-2xl font-semibold">Video</h2>
            <div className="mt-4 aspect-video overflow-hidden rounded-xl">
              <iframe
                src={embedUrl}
                title="Memorial video"
                className="h-full w-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemorialPage;
