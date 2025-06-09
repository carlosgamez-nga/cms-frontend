import React, { cloneElement } from 'react';
import { PiWarningOctagonBold } from 'react-icons/pi';

type PlaceholderProps = {
  label: string;
  icon?: React.ReactElement<any>;
  button?: React.ReactElement;
};
const Placeholder = ({
  label,
  icon = <PiWarningOctagonBold />,
  button = <div className='h-10' />,
}: PlaceholderProps) => {
  return (
    <div className='flex-1 self-center flex flex-col items-center justify-center gap-y-2'>
      {cloneElement(icon, { className: 'w-16 h-16' })}
      <h2 className='text-lg text-center'>{label}</h2>
      {button}
    </div>
  );
};

export default Placeholder;
