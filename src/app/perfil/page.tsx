'use client';

import { useState, useEffect } from 'react';
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

export default function PerfilPage() {
  const { user, updateUser, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUser({ name, email });
    toast({
      title: 'Perfil actualizado',
      description: 'Tus datos han sido guardados correctamente.',
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // En una app real, aquí iría la lógica para cambiar la contraseña
    toast({
      title: 'Contraseña actualizada',
      description: 'Tu contraseña ha sido cambiada con éxito (simulado).',
    });
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <div className="flex h-screen items-center justify-center">No has iniciado sesión.</div>;
  }

  return (
    <main>
      <Header title="Perfil" />
      <div className="p-4 sm:p-6">
        <div className="max-w-2xl grid gap-6">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Tu Perfil</CardTitle>
                <CardDescription>
                  Actualiza tu nombre y dirección de correo electrónico.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
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
                <Button type="submit">Guardar Cambios</Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <form onSubmit={handlePasswordSubmit}>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                  Cambia tu contraseña.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña Actual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <Input id="new-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Cambiar Contraseña</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
