'use client';

import Placeholder from '@/components/placeholder';

const Error = ({ error }: { error: Error }) => {
  return (
    <div className='mt-32 flex items-center justify-center'>
      <Placeholder label={error.message || 'Something went wrong!'} />
    </div>
  );
};

export default Error;
