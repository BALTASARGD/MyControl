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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUser({ name, email });
    toast({
        title: 'Perfil actualizado',
        description: 'Tus datos han sido guardados correctamente.',
    })
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
        <div className="max-w-2xl">
          <Card>
            <form onSubmit={handleSubmit}>
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
                    onChange={(e) => setEmail(e.event.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Guardar Cambios</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}
