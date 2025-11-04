
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { useTheme } from 'next-themes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function AjustesPage() {
  const { setTheme, theme } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteData = () => {
    // This code runs only on the client side
    localStorage.removeItem('transactions');
    window.dispatchEvent(new Event('storage'));
    setIsDialogOpen(false);
  };

  return (
    <main className="p-4 sm:p-6">
      <Heading>Ajustes</Heading>

      <div className="mt-6 grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Apariencia</CardTitle>
            <CardDescription>
              Personaliza la apariencia de la aplicación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="theme-switch"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
              <Label htmlFor="theme-switch">Tema Oscuro</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestión de Datos</CardTitle>
            <CardDescription>
              Administra los datos de tu aplicación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={() => setIsDialogOpen(true)}>
              Borrar todas las transacciones
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Esta acción es irreversible y eliminará todos los datos de transacciones almacenados localmente.
            </p>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán permanentemente
              todas tus transacciones del almacenamiento local.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteData} className="bg-destructive hover:bg-destructive/90">
              Sí, borrar datos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
