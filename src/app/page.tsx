'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gavel, BotMessageSquare, FileText, CheckCircle } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { placeholderImages } from '@/lib/placeholder-images';
import { useTranslation } from '@/hooks/use-translation';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <BotMessageSquare className="h-8 w-8 text-primary" />,
      title: t('home.features.aiGuidance.title'),
      description: t('home.features.aiGuidance.description'),
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: t('home.features.complaintFiling.title'),
      description: t('home.features.complaintFiling.description'),
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: t('home.features.secure.title'),
      description: t('home.features.secure.description'),
    },
  ];

  const heroImage = placeholderImages.find(p => p.id === 'hero');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button asChild variant="ghost">
              <Link href="/signin">{t('home.nav.signin')}</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">{t('home.nav.getStarted')}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="absolute inset-0 h-full w-full object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
           )}
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container relative z-10 px-4 text-center text-primary-foreground md:px-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline">
                  {t('home.hero.title')}
                </h1>
                <p className="mt-6 text-lg text-gray-200 md:text-xl">
                  {t('home.hero.subtitle')}
                </p>
                <div className="mt-10 flex justify-center gap-4">
                  <Button asChild size="lg">
                    <Link href="/signup">{t('home.hero.startForFree')}</Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary">
                    <Link href="#features">{t('home.hero.learnMore')}</Link>
                  </Button>
                </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 md:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                    {t('home.features.title')}
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                    {t('home.features.subtitle')}
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {t('home.features.description')}
                  </p>
                </div>
                <ul className="grid gap-6">
                  {features.map((feature, index) => (
                    <li key={index}>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-3">
                           {feature.icon}
                           <h3 className="text-xl font-bold">{feature.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
               {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt="Abstract legal image"
                  width={550}
                  height={550}
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                  data-ai-hint={heroImage.imageHint}
                />
               )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex h-14 items-center justify-between">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              {t('footer.terms')}
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
