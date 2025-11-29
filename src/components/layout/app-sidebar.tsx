'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { Logo } from '@/components/layout/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  BotMessageSquare,
  FileText,
  LogOut,
  User,
  ChevronDown,
  Languages,
  Globe,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translation';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const navItems = [
    { href: '/dashboard', icon: <LayoutDashboard />, label: t('sidebar.nav.dashboard') },
    { href: '/chatbot', icon: <BotMessageSquare />, label: t('sidebar.nav.aiChatbot') },
    { href: '/complaint', icon: <FileText />, label: t('sidebar.nav.fileComplaint') },
    { href: '/translate', icon: <Languages />, label: t('sidebar.nav.translate') },
  ];

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/signin');
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || <User size={20} />;

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <div className="p-2 flex flex-col gap-2">
          <label
            htmlFor="language-select"
            className="text-sm font-medium text-muted-foreground flex items-center gap-2"
          >
            <Globe size={16} />
            {t('sidebar.languageSelector.label')}
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language-select">
              <SelectValue placeholder={t('sidebar.languageSelector.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('sidebar.languageSelector.english')}</SelectItem>
              <SelectItem value="ta">{t('sidebar.languageSelector.tamil')}</SelectItem>
              {/* Add other languages here in the future */}
            </SelectContent>
          </Select>
        </div>
        <SidebarMenu>
          {navItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  as="a"
                  isActive={pathname === item.href}
                  className="w-full"
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-12">
              <div className="flex justify-between items-center w-full">
                <div className="flex gap-2 items-center truncate">
                  <Avatar className="h-8 w-8">
                    {user?.photoURL && <AvatarImage src={user.photoURL} />}
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start truncate">
                    <span className="text-sm font-medium truncate">
                      {user?.displayName || user?.email}
                    </span>
                  </div>
                </div>
                <ChevronDown size={18} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.displayName || t('sidebar.userMenu.user')}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('sidebar.userMenu.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
