import { cookies } from 'next/headers';

import AppSidebar from './components/sidebar/app-sidebar';
import Navbar from './components/navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/providers/ThemeProvider';

const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className='w-full'>
          <Navbar />
          <div className='px-8'>{children}</div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default layout;
