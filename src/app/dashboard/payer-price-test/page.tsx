import PayerPriceAnalysisView from '@/features/payer-price/components/payer-price-analysis-view';

const PayerPriceTestPage = () => {
  return (
    <div className='space-y-6 mt-8'>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold'>Payer Price Test</h2>
      </div>
      <PayerPriceAnalysisView />
    </div>
  );
};

export default PayerPriceTestPage;

