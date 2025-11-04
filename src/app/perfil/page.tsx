'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { Header } from '@/components/dashboard/header';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useI18n } from '@/lib/i18n';

export default function PerfilPage() {
  const { t } = useI18n();
  const { user, updateUser, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUser({ name, email });
    toast({
      title: t('profile_updated'),
      description: t('profile_updated_desc'),
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // En una app real, aquí iría la lógica para cambiar la contraseña
    toast({
      title: t('password_updated'),
      description: t('password_updated_desc'),
    });
  };
  
  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const newAvatarUrl = loadEvent.target?.result as string;
        if (newAvatarUrl) {
          setAvatarUrl(newAvatarUrl);
          updateUser({ avatarUrl: newAvatarUrl });
          toast({
            title: t('avatar_updated'),
            description: t('avatar_updated_desc'),
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">{t('loading')}...</div>;
  }

  if (!user) {
    return <div className="flex h-screen items-center justify-center">{t('not_logged_in')}</div>;
  }

  return (
    <main>
      <Header title={t('profile')} />
      <div className="p-4 sm:p-6">
        <div className="max-w-2xl grid gap-6">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>{t('your_profile')}</CardTitle>
                <CardDescription>
                  {t('update_profile_info')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2 flex flex-col items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} alt="User avatar" />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline" size="sm" onClick={handleChangePhotoClick}>
                    {t('change_photo')}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">{t('save_changes')}</Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <form onSubmit={handlePasswordSubmit}>
              <CardHeader>
                <CardTitle>{t('security')}</CardTitle>
                <CardDescription>
                  {t('change_your_password')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">{t('current_password')}</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('new_password')}</Label>
                  <Input id="new-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">{t('change_password')}</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
