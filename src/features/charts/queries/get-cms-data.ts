import { CMSData } from '@/lib/types';

export const getCMSData = async (): Promise<CMSData> => {
  // testing only
  await new Promise((res) => setTimeout(res, 2000));

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cms_data/`);

  return res.json();
};
