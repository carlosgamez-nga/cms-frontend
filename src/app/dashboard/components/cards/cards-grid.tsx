import CardOverview from './card-overview';

const CardsGrid = () => {
  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <CardOverview title="Total Contracts" amount="1,245" percentage="+15%" />
        <CardOverview title="Active Payers" amount="42" percentage="+5%" />
        <CardOverview title="Pending Uploads" amount="18" percentage="-2%" />
        <CardOverview title="Expiring Soon" amount="4" percentage="0%" />
    </div>
  );
};

export default CardsGrid;
