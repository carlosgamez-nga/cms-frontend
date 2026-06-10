import KpiCard from './KpiCard';

interface KpiItem {
  title: string;
  value: string | number;
  trend?: string;
}

interface KpiGridProps {
  items: KpiItem[];
}

const KpiGrid = ({ items }: KpiGridProps) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
      {items.map((item) => (
        <KpiCard
          key={item.title}
          title={item.title}
          value={item.value}
          trend={item.trend}
        />
      ))}
    </div>
  );
};

export default KpiGrid;
