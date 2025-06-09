import CardsGrid from './components/cards/cards-grid';
import ContractsRevenue from './components/contracts-revenue/contracts-revenue';
import Heading from './components/heading';
import LastContracts from './components/last-contracts/last-contracts';

export default function Home() {
  return (
    <div className=''>
      <Heading title='Your Dashboard' />
      <CardsGrid />
      <div className='grid grid-cols-1 xl:grid-cols-2 md:gap-x-10 mt-8 gap-y-4'>
        <LastContracts />
        <ContractsRevenue />
      </div>

      <div className='flex-col xl:flex xl:flex-row gap-y-4 md:gap-y-0 mt-8 md:mt-6 justify-center md:gap-x-10'></div>
    </div>
    // <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4'>
    //   <div className='rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2'></div>
    //   <div className='bg-primary-foreground p-4 rounded-lg'>test</div>
    //   <div className='bg-primary-foreground p-4 rounded-lg'>test</div>
    //   <div className='bg-primary-foreground p-4 rounded-lg'>test</div>
    //   <div className='rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2'></div>
    //   <div className='bg-primary-foreground p-4 rounded-lg'>test</div>
    // </div>
  );
}
