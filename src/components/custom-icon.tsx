import { LucideIcon } from 'lucide-react';

interface CustomIconProps {
  icon: LucideIcon;
}

const CustomIcon = ({ icon: Icon }: CustomIconProps) => {
  return (
    <div className='p-2 bg-primary/10 rounded-lg'>
      <Icon strokeWidth={1} className='w-4 h-4' />
    </div>
  );
};

export default CustomIcon;
