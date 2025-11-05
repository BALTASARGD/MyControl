import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

type StatsCardProps = {
  title: string;
  amount: string;
  description: string;
  icon: LucideIcon;
  change: number;
  variant?: 'income' | 'expenses' | 'savings';
  intensity?: 'subtle' | 'strong';
  active?: boolean;
  href?: string;
  onClick?: () => void;
};

export default function StatsCard({
  title,
  amount,
  description,
  icon: Icon,
  change,
  variant = 'savings',
  intensity = 'subtle',
  active = false,
  href,
  onClick,
}: StatsCardProps) {
  const ChangeIcon = change > 0 ? ArrowUp : ArrowDown;
  const showChange = change !== 0;
  // Determine classes based on variant/intensity/active
  const baseClasses = cn(
    'p-4 sm:p-6 transition-shadow rounded-lg',
    intensity === 'subtle' && (variant === 'income' ? 'bg-green-50/60 dark:bg-green-900/30' : variant === 'expenses' ? 'bg-red-50/60 dark:bg-red-900/30' : 'bg-indigo-50/60 dark:bg-indigo-900/30'),
    intensity === 'strong' && (variant === 'income' ? 'bg-green-600 text-white' : variant === 'expenses' ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'),
    active && 'relative before:content-[""] before:absolute before:left-0 before:top-3 before:bottom-3 before:w-1 before:rounded-r-md',
    active && (variant === 'income' ? 'before:bg-green-600' : variant === 'expenses' ? 'before:bg-red-600' : 'before:bg-indigo-600'),
    (href || onClick) && 'cursor-pointer hover:shadow-lg'
  );

  const content = (
    <Card className={baseClasses} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn('text-base sm:text-lg font-semibold', intensity === 'strong' ? 'text-white' : 'text-slate-900 dark:text-slate-100')}>{title}</CardTitle>
        <Icon className={cn('h-6 w-6', intensity === 'strong' ? 'text-white/90' : variant === 'income' ? 'text-green-600' : variant === 'expenses' ? 'text-red-600' : 'text-indigo-600')} />
      </CardHeader>
      <CardContent>
        <div className={cn('text-3xl sm:text-4xl font-extrabold', intensity === 'strong' ? 'text-white' : 'text-slate-900 dark:text-slate-100')}>{amount}</div>
        <p className={cn('text-sm flex items-center mt-2', intensity === 'strong' ? 'text-white/90' : 'text-slate-700 dark:text-slate-300')}>
          {showChange ? (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-medium',
                change > 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              <ChangeIcon className="h-4 w-4" />
              {description}
            </span>
          ) : (
            <span>{description}</span>
          )}
        </p>
      </CardContent>
    </Card>
  );

  if (href) {
    // Link requires a non-undefined href; type narrowed by check
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
