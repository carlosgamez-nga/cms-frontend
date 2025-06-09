import CardOverview from './card-overview';

const CardsGrid = () => {
  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
      <CardOverview />
      <CardOverview />
      <CardOverview />
      <CardOverview />
    </div>
  );
};

export default CardsGrid;
