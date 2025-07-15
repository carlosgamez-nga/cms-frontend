// data-table.tsx
'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Contract } from '@/lib/types'; // Ensure this import is correct

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[]; // This `data` prop should be the array of contracts
  isDashboard?: boolean;
}

const DataTable = <TData, TValue>({
  columns,
  data, // The array of contracts from ContractList
  isDashboard = false,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- DEBUGGING STEP 1 ---
  // Log the raw 'data' prop received by DataTable
  console.log('DataTable (Prop): Raw data received:', data);
  console.log('DataTable (Prop): Is data an array?', Array.isArray(data));
  console.log('DataTable (Prop): Number of items in data:', data?.length);
  if (data?.length > 0) {
    console.log('DataTable (Prop): First item in data:', data[0]);
    console.log('DataTable (Prop): Type of ID in first item:', typeof (data[0] as any).id);
    console.log('DataTable (Prop): Value of ID in first item:', (data[0] as any).id);
  }
  // --- END DEBUGGING STEP 1 ---

  const displayedData = isDashboard ? data.slice(0, 5) : data;

  const table = useReactTable({
    data: displayedData, // This is the data source for the table instance
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    getRowId: (row: TData) => (row as Contract).id.toString(), // Your existing getRowId
  });

  // --- DEBUGGING STEP 2 ---
  // Log what the table instance *itself* sees as rows
  console.log('DataTable (Instance): Table instance row count:', table.getRowModel().rows.length);
  if (table.getRowModel().rows.length > 0) {
    console.log('DataTable (Instance): First row model ID:', table.getRowModel().rows[0].id);
    console.log('DataTable (Instance): First row model original data:', table.getRowModel().rows[0].original);
  }
  // --- END DEBUGGING STEP 2 ---

  if (!isMounted) {
    return null;
  }

  return (
    <div className='p-4 border bg-background shadow-sm rounded-lg mt-4 md:w-full lg:max-w-[1024px] lg:mx-auto '>
      <div className='flex items-center py-4'>
        <Label
          htmlFor='search'
          className='min-w-[80px] text-sm font-medium mr-2'
        >
          Search
        </Label>
        <Input
          id='search'
          placeholder='Search contract by title...'
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('title')?.setFilterValue(e.target.value)
          }
        />
      </div>
      <div className='rounded-md'>
        <div className='rounded-md border overflow-x-auto w-full'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {/* This is the condition that determines if rows are shown or "No results." */}
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className='md:overflow-hidden md:text-ellipsis md:whitespace-nowrap md:max-w-[135px]'
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!isDashboard && (
          <div className='flex items-center justify-end space-x-2 py-4'>
            <div className='text-muted-foreground flex-1 text-sm'>
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className='space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;