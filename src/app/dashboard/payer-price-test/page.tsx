import PayerPriceOverviewPrototype from '@/features/payer-price/components/payer-price-overview-prototype';

const PayerPriceTestPage = () => {
  return (
    <div className='space-y-6 mt-8'>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold'>Contract Overview</h2>
      </div>
      <PayerPriceOverviewPrototype />

      {/*
      <MarketAnalysisPanel />
      Detailed billing/negotiation analysis is intentionally removed from overview.
      Re-enable this panel when the dedicated Market Analysis page is introduced.
      */}
    </div>
  );
};

export default PayerPriceTestPage;
