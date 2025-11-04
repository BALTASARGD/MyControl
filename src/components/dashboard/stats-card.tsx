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

type StatsCardProps = {
  title: string;
  amount: string;
  description: string;
  icon: LucideIcon;
  change: number;
};

export default function StatsCard({
  title,
  amount,
  description,
  icon: Icon,
  change,
}: StatsCardProps) {
  const ChangeIcon = change > 0 ? ArrowUp : ArrowDown;
  const showChange = change !== 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{amount}</div>
        <p className="text-xs text-muted-foreground flex items-center">
            {showChange ? (
                 <span className={cn(
                    "flex items-center gap-1",
                    change > 0 ? "text-green-600" : "text-red-600"
                )}>
                    <ChangeIcon className="h-3 w-3" />
                    {description}
                </span>
            ) : (
                <span>{description}</span>
            )}
        </p>
      </CardContent>
    </Card>
  );
}
