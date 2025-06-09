import { LucideIcon } from 'lucide-react';

interface CardSummaryProps {
  icon: LucideIcon;
  total: string;
  averge: number;
  title: string;
  tooltipText: string;
}

const CardSummary = ({ ...props }: CardSummaryProps) => {
  return <div>CardSummary</div>;
};

// export default CardSummary;
