'use server';

export const deleteContract = async (
  id: string
): Promise<Response | undefined> => {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contracts/${id}`, {
    method: 'DELETE',
  });
};
