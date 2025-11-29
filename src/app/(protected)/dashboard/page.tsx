'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { placeholderImages } from '@/lib/placeholder-images';
import { BotMessageSquare, FileText, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const welcomeImage = placeholderImages.find(p => p.id === 'dashboard-welcome');
  const chatbotImage = placeholderImages.find(p => p.id === 'chatbot-card');
  const complaintImage = placeholderImages.find(p => p.id === 'complaint-card');
  
  return (
    <div className="container mx-auto p-0">
      <div className="space-y-8">
        <Card className="overflow-hidden">
          <div className="relative h-48 w-full md:h-64">
            {welcomeImage && (
              <Image
                src={welcomeImage.imageUrl}
                alt={welcomeImage.description}
                fill
                objectFit="cover"
                data-ai-hint={welcomeImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <h1 className="text-3xl font-bold text-white md:text-4xl">
                {t('dashboard.welcome.title')}, {user?.displayName || user?.email?.split('@')[0] || t('dashboard.user')}!
              </h1>
              <p className="mt-2 text-lg text-gray-200">
                {t('dashboard.welcome.subtitle')}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <BotMessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{t('dashboard.chatbot.title')}</CardTitle>
                  <CardDescription>{t('dashboard.chatbot.description')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              {chatbotImage && (
                  <Image
                    src={chatbotImage.imageUrl}
                    alt={chatbotImage.description}
                    width={400}
                    height={200}
                    className="w-full rounded-lg object-cover aspect-video"
                    data-ai-hint={chatbotImage.imageHint}
                  />
                )}
              <p className="text-muted-foreground">
                {t('dashboard.chatbot.text')}
              </p>
            </CardContent>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/chatbot">
                  {t('dashboard.chatbot.button')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{t('dashboard.complaint.title')}</CardTitle>
                  <CardDescription>{t('dashboard.complaint.description')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
             {complaintImage && (
                  <Image
                    src={complaintImage.imageUrl}
                    alt={complaintImage.description}
                    width={400}
                    height={200}
                    className="w-full rounded-lg object-cover aspect-video"
                    data-ai-hint={complaintImage.imageHint}
                  />
                )}
              <p className="text-muted-foreground">
                {t('dashboard.complaint.text')}
              </p>
            </CardContent>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/complaint">
                  {t('dashboard.complaint.button')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
