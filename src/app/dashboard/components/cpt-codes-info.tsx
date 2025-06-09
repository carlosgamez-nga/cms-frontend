'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    code: '36475',
    current: 13,
    last: 100,
  },
  {
    code: '36478',
    current: 25,
    last: 100,
  },
  {
    code: '36482',
    current: 8,
    last: 100,
  },
  {
    code: '37253',
    current: 7,
    last: 100,
  },
  {
    code: '76942',
    current: 2,
    last: 100,
  },
  {
    code: '93970',
    current: 9,
    last: 100,
  },
  {
    code: '93971',
    current: 1,
    last: 100,
  },
  {
    code: '93976',
    current: 3,
    last: 100,
  },
  {
    code: '99212',
    current: 5,
    last: 100,
  },
  {
    code: '99213',
    current: 8,
    last: 100,
  },
];

const CPTCodesInfo = () => {
  const CustomYAxisTickFormatter = (value: number) => {
    return value === 100 ? '100%' : ''; // Show "100%" only for value 100
  };

  return (
    <ResponsiveContainer height={350} width='100%'>
      <BarChart
        data={data}
        className='[&_.recharts-tooltip-cursor]:fill-zinc-200 dark:[&_.recharts-tooltip-cursor]:fill-zinc-800'
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='code' />
        <YAxis
          tickFormatter={CustomYAxisTickFormatter}
          domain={[0, 150]}
          ticks={[0, 100]} // Only show ticks for 0 and 100
        />
        <Tooltip
          formatter={(value, name) => {
            if (name === 'current') {
              return [value, 'Current fee'];
            } else if (name === 'last') {
              return [value, 'Last fee'];
            }
          }}
          separator=': '
          wrapperClassName='!text-sm rounded-md dark:!bg-black dark:!border-border'
          labelClassName='font-bold'
        />
        <Legend
          iconType='circle'
          formatter={(value) => {
            if (value === 'current') {
              return <div className='text-sm'>Current fee</div>;
            } else if (value === 'last') {
              return <div className='text-sm'>Last fee</div>;
            }
          }}
        />
        <Bar dataKey='last' stackId='a' fill='#42BAEB' />
        <Bar dataKey='current' stackId='a' fill='#363BC2' radius={[4, 4, 0, 0]}>
          <LabelList dataKey='current' position='top' />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CPTCodesInfo;
