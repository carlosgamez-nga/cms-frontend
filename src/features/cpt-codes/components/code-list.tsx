import { Badge } from '@/components/ui/badge';
import { CodeCPT } from '@/lib/types';
type CodesProps = {
  codes: CodeCPT[];
};

const CodeList = ({ codes }: CodesProps) => {
  return (
    <div className='supports-backdrop-blur:bg-background/60 backdrop-blur w-full flex justify-start gap-4 items-center flex-wrap mx-2'>
      <div className='flex justify-start gap-1 lg:gap-2 items-center flex-wrap'>
        <span className='text-sm font-bold'>CPT Codes:</span>
        {codes.map((code) => (
          <Badge
            key={code.cpt_code}
            variant='secondary'
            className='bg-primary/10'
          >
            {code.cpt_code}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CodeList;
