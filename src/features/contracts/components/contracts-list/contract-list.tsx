import { getContracts } from '@/features/contracts/queries/get-contracts';
import DataTable from './data-table';
import { columns } from './columns';
const ContractList = async () => {
  const contracts = await getContracts();

  return (
    <div>
      <DataTable columns={columns} data={contracts} />
    </div>
  );
};

export default ContractList;
