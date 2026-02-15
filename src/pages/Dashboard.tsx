import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Memorial {
  id: string;
  full_name: string;
  birth_date: string;
  death_date: string;
  slug: string;
  cover_image_url: string | null;
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMemorials = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('memorials')
      .select('id, full_name, birth_date, death_date, slug, cover_image_url')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setMemorials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMemorials();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    // Delete photos from storage
    const { data: photos } = await supabase
      .from('memorial_photos')
      .select('photo_url')
      .eq('memorial_id', deleteId);

    if (photos?.length) {
      const paths = photos.map((p) => {
        const url = new URL(p.photo_url);
        return url.pathname.split('/storage/v1/object/public/memorial-images/')[1];
      }).filter(Boolean);
      if (paths.length) await supabase.storage.from('memorial-images').remove(paths);
    }

    // Delete the memorial cover from storage
    const memorial = memorials.find((m) => m.id === deleteId);
    if (memorial?.cover_image_url) {
      try {
        const url = new URL(memorial.cover_image_url);
        const path = url.pathname.split('/storage/v1/object/public/memorial-images/')[1];
        if (path) await supabase.storage.from('memorial-images').remove([path]);
      } catch {}
    }

    await supabase.from('memorial_photos').delete().eq('memorial_id', deleteId);
    const { error } = await supabase.from('memorials').delete().eq('id', deleteId);
    setDeleting(false);
    setDeleteId(null);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete memorial.', variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Memorial has been removed.' });
      fetchMemorials();
    }
  };

  return (
    <div className="py-12">
      <div className="container max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">
              Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
            </h1>
            <p className="mt-1 text-muted-foreground">Manage your memorials</p>
          </div>
          <Button asChild>
            <Link to="/create-memorial"><Plus className="mr-2 h-4 w-4" />Create Memorial</Link>
          </Button>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : memorials.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground">You haven't created any memorials yet.</p>
            <p className="mt-2 text-muted-foreground">Create one to honor someone special.</p>
            <Button asChild className="mt-6">
              <Link to="/create-memorial"><Plus className="mr-2 h-4 w-4" />Create Your First Memorial</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {memorials.map((m) => (
              <Card key={m.id} className="overflow-hidden" style={{ boxShadow: 'var(--shadow-soft)' }}>
                <div className="h-36 bg-muted">
                  {m.cover_image_url && (
                    <img src={m.cover_image_url} alt={m.full_name} className="h-full w-full object-cover" />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-heading text-lg font-semibold">{m.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{m.birth_date} — {m.death_date}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/memorial/${m.slug}`}><Eye className="mr-1 h-3 w-3" />View</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/edit-memorial/${m.id}`}><Pencil className="mr-1 h-3 w-3" />Edit</Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteId(m.id)}>
                      <Trash2 className="mr-1 h-3 w-3" />Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Memorial</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The memorial and all its photos will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
