'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Contract, CodeCPT } from '../../../app/dashboard/types';
import { clsx } from 'clsx';
import { deleteContract } from '../queries/delete-contract';

type ContractProps = {
  contract: Contract;
  isDetail?: boolean;
  data?: CodeCPT[];
};

const ContractItem = ({ contract, isDetail }: ContractProps) => {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      const res = await deleteContract(id);
      if (res && res.status === 204) {
        router.push('/dashboard/contracts');
      }
    }
  };

  // const handleEdit = () => {};

  return (
    <div
      className={clsx('w-full flex gap-x-1 animate-fade-in-from-top', {
        'max-w-[450px] ': !isDetail,
        'w-full col-span-6 lg:col-span-2': isDetail,
      })}
    >
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>{contract.payer_name}</CardTitle>
          <CardDescription>{contract.state}</CardDescription>
        </CardHeader>
        <CardContent>
          <p
            className={clsx('whitespace-break-spaces', {
              'line-clamp-3': !isDetail,
            })}
          >
            {contract.description}
          </p>
          <div className='text-sm text-muted-foreground'>
            <div className='flex justify-between'>
              <span>Effective Date:</span> {contract.effective_date}
            </div>
            <div className='flex justify-between'>
              <span>Uploaded:</span> {contract.uploaded_at}
            </div>
          </div>
        </CardContent>
        {isDetail ? (
          <CardFooter className='justify-end flex gap-2'>
            {/* <Button variant='outline'>Edit</Button> */}
            <Button
              variant='destructive'
              onClick={() => handleDelete(contract.id.toString())}
            >
              Delete
            </Button>
          </CardFooter>
        ) : (
          <CardFooter>
            <Link
              href={`dashboard/contracts/${contract.id}`}
              className='text-sm underline'
            >
              Show Contract
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ContractItem;
