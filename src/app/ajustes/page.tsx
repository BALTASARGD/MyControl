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
import { Header } from '@/components/dashboard/header';
import { useI18n } from '@/lib/i18n';

export default function AjustesPage() {
  const { t } = useI18n();
  const { setTheme, theme } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteData = () => {
    // This code runs only on the client side
    if (typeof window !== 'undefined') {
      localStorage.removeItem('transactions');
      window.dispatchEvent(new Event('storage'));
    }
    setIsDialogOpen(false);
  };

  return (
    <main>
      <Header title={t('settings')} />
      <div className="p-4 sm:p-6">
        <div className="grid gap-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>{t('appearance')}</CardTitle>
              <CardDescription>
                {t('customize_appearance')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="theme-switch"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
                <Label htmlFor="theme-switch">{t('dark_theme')}</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('data_management')}</CardTitle>
              <CardDescription>
                {t('manage_app_data')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={() => setIsDialogOpen(true)}>
                {t('delete_all_transactions')}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                {t('action_irreversible')}
              </p>
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('are_you_sure')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('action_cannot_be_undone')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteData} className="bg-destructive hover:bg-destructive/90">
                {t('confirm_delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
