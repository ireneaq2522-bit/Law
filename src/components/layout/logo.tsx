'use client';

import { Gavel } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';


export function Logo() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary text-primary-foreground p-2 rounded-md">
        <Gavel className="h-6 w-6" />
      </div>
      <span className="text-xl font-semibold text-primary">
        {t('logo.text')}
      </span>
    </div>
  );
}
