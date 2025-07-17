import Gradient from '@/components/gradient';
import { Toaster } from '@/components/ui/sonner';

type Props = {
  children?: React.ReactNode;
};

const LayoutAuth = ({ children }: Props) => {
  return (
    <>
      <div className='flex flex-col gap-4 min-h-screen items-center justify-center p-24'>
        {children}
        <Toaster closeButton richColors />
      </div>

      <Gradient />
    </>
  );
};

export default LayoutAuth;
