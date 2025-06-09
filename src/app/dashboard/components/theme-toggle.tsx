import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PiCircleHalfFill } from 'react-icons/pi';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  children?: React.ReactNode;
};

const ThemeToggle = ({ className, children }: Props) => {
  const handleClick = () => {
    document.body.classList.toggle('dark');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onClick={handleClick}
          className={cn(`${className} flex gap-2 items-center w-full`)}
        >
          <PiCircleHalfFill size={24} />
          {children}
        </TooltipTrigger>
        <TooltipContent>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
