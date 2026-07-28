'use client';

import { useState, useEffect } from 'react';
import {
  PanelsTopLeft,
  FileText,
  UserRound,
  ChevronUp,
  Settings,
  LogOut,
} from 'lucide-react';
import ngaLogo from '/public/logo.svg';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppSidebarItem from './app-sidebar-item';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: PanelsTopLeft,
  },
  {
    title: 'Contracts',
    url: '/dashboard/contracts',
    icon: FileText,
  },
];

const AppSidebar = () => {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState('Loading...');
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const loadUserData = () => {
      const storedEmail = localStorage.getItem('userEmail');
      const storedName = localStorage.getItem('userName');
      if (storedEmail) setUserEmail(storedEmail);
      if (storedName) setUserName(storedName);
    };

    loadUserData();

    window.addEventListener('storage', loadUserData);
    window.addEventListener('user-profile-updated', loadUserData);

    return () => {
      window.removeEventListener('storage', loadUserData);
      window.removeEventListener('user-profile-updated', loadUserData);
    };
  }, []);

  const handleLogout = () => {
    // 1. Destroy the auth cookie
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // 2. Clear out the saved user data
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    // 3. Send the user back to the login screen
    router.push('/sign-in');
  };

  const getInitials = (name: string) => {
    return name.match(/(\b\S)?/g)?.join('').substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='py-4'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/dashboard' className='text-foreground'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <Image src={ngaLogo} alt='NGA healthcare logo' height={32} />
                </div>
                <div className='flex flex-col gap-0.5 leading-none'>
                  <span className='font-semibold'>NGA Healthcare</span>
                  <span className='text-xs'>Contract Management System</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <AppSidebarItem key={item.title} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              
              {/* TRIGGER BUTTON (Sidebar Footer) */}
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src={ngaLogo.src} alt='NGA Logo' />
                    <AvatarFallback className='rounded-lg'>{getInitials(userName)}</AvatarFallback>
                  </Avatar>{' '}
                  {userName} <ChevronUp className='ml-auto' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              {/* DROPDOWN MENU CONTENT */}
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <Avatar className='h-8 w-8 rounded-lg bg-white p-1'>
                      <AvatarImage src={ngaLogo.src} alt='NGA Logo' />
                      <AvatarFallback className='rounded-lg'>{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>{userName}</span>
                      <span className='truncate text-xs text-slate-500'>
                        {userEmail}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className='cursor-pointer'>
                    <Link href='/dashboard/profile'>
                      <UserRound className='mr-2' size={20} /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className='cursor-pointer'>
                    <Link href='/dashboard/settings'>
                      <Settings className='mr-2' size={20} /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* LOGOUT BUTTON */}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className='mr-2' size={20} /> Logout
                  </DropdownMenuItem>
                  
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;