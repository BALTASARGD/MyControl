'use client';

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
import { useI18n } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { t } = useI18n();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('usuario@micontrol.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Usuario');
  const { login, register, loginAsGuest } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = () => {
    try {
      if (isLoginView) {
        login(email, password);
        router.push('/');
      } else {
        if (!name || !email || !password) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Por favor, completa todos los campos.',
          });
          return;
        }
        register(name, email, password);
        toast({
          title: '¡Registro completado!',
          description: 'Ahora puedes iniciar sesión con tu nueva cuenta.',
        });
        setIsLoginView(true); // Cambiar a la vista de login después del registro
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: error.message,
      });
    }
  };
  
  const handleGuestLogin = () => {
    loginAsGuest();
    router.push('/');
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{isLoginView ? t('login') : 'Registro'}</CardTitle>
          <CardDescription>
            {isLoginView
              ? t('login_to_dashboard')
              : 'Crea una cuenta para empezar a gestionar tus finanzas.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!isLoginView && (
            <div className="grid gap-2">
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('your_name')}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@ejemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSubmit}>
            {isLoginView ? t('login') : 'Crear cuenta'}
          </Button>
           <Button variant="link" size="sm" onClick={handleGuestLogin}>
            Entrar como invitado
          </Button>
        </CardFooter>
        <CardFooter>
          <Button
            variant="link"
            className="w-full"
            onClick={() => setIsLoginView(!isLoginView)}
          >
            {isLoginView
              ? '¿No tienes una cuenta? Regístrate'
              : '¿Ya tienes una cuenta? Inicia sesión'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
