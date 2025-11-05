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
  
  const isGuest = user?.isGuest || false;


  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isGuest) return;
    updateUser({ name, email });
    toast({
      title: t('profile_updated'),
      description: t('profile_updated_desc'),
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isGuest) return;
    // En una app real, aquí iría la lógica para cambiar la contraseña
    toast({
      title: t('password_updated'),
      description: t('password_updated_desc'),
    });
  };
  
  const handleChangePhotoClick = () => {
    if (isGuest) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isGuest) return;
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
          {isGuest && (
            <Card className="bg-yellow-50 border-yellow-300">
                <CardHeader>
                    <CardTitle>Modo Invitado</CardTitle>
                    <CardDescription>
                        Las funciones de edición de perfil están desactivadas en el modo de invitado. Inicia sesión para guardar tus cambios.
                    </CardDescription>
                </CardHeader>
            </Card>
          )}
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
                  <Button type="button" variant="outline" size="sm" onClick={handleChangePhotoClick} disabled={isGuest}>
                    {t('change_photo')}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={isGuest}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isGuest}
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
                    disabled={isGuest}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isGuest}>{t('save_changes')}</Button>
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
                  <Input id="current-password" type="password" disabled={isGuest} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('new_password')}</Label>
                  <Input id="new-password" type="password" disabled={isGuest} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isGuest}>{t('change_password')}</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
