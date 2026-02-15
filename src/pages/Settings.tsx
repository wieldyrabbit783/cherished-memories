import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user, profile, updateProfile, updatePassword } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [newPassword, setNewPassword] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setSavingName(true);
    const { error } = await updateProfile(fullName.trim());
    setSavingName(false);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update name.', variant: 'destructive' });
    } else {
      toast({ title: 'Saved', description: 'Name updated.' });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast({ title: 'Error', description: 'Password must be at least 8 characters.', variant: 'destructive' });
      return;
    }
    setSavingPass(true);
    const { error } = await updatePassword(newPassword);
    setSavingPass(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved', description: 'Password updated.' });
      setNewPassword('');
    }
  };

  return (
    <div className="py-12">
      <div className="container max-w-lg">
        <h1 className="font-heading text-3xl font-bold">Account Settings</h1>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Account Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Email:</strong> {user?.email}</p>
            <p><strong className="text-foreground">Member since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Update Name</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNameUpdate} className="flex gap-3">
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="flex-1" />
              <Button type="submit" disabled={savingName}>{savingName ? 'Saving…' : 'Save'}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 characters" />
              </div>
              <Button type="submit" disabled={savingPass}>{savingPass ? 'Updating…' : 'Update Password'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
