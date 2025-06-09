'use client';

import Link from 'next/link';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AppSideItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
}

const AppSidebarItem = ({ title, url, icon: Icon }: AppSideItemProps) => {
  const pathname = usePathname();

  const activePath = pathname === url;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={url} className={cn(activePath && 'bg-slate-400/20')}>
          <Icon className='h-5 w-5' strokeWidth={1} />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default AppSidebarItem;
