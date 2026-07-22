'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/spinner';
import { postContract } from '../queries/post-contract';
import { finalizeContract } from '../queries/finalize-contract';

type ContractUploadProps = { title: string };
type FormStep = 'UPLOAD' | 'CONFIRM_DATE';

// --- STEP 1: Update the states array to be an array of objects ---
// This allows us to show the full name but use the two-letter code as the value.
const states = [
  { name: 'Alabama', code: 'AL' }, { name: 'Alaska', code: 'AK' }, { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' }, { name: 'California', code: 'CA' }, { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' }, { name: 'Delaware', code: 'DE' }, { name: 'Florida', code: 'FL' },
  { name: 'Georgia', code: 'GA' }, { name: 'Hawaii', code: 'HI' }, { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' }, { name: 'Indiana', code: 'IN' }, { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' }, { name: 'Kentucky', code: 'KY' }, { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' }, { name: 'Maryland', code: 'MD' }, { name: 'Massachusetts', code: 'MA' },
  { name: 'Michigan', code: 'MI' }, { name: 'Minnesota', code: 'MN' }, { name: 'Mississippi', code: 'MS' },
  { name: 'Missouri', code: 'MO' }, { name: 'Montana', code: 'MT' }, { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' }, { name: 'New Hampshire', code: 'NH' }, { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' }, { name: 'New York', code: 'NY' }, { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' }, { name: 'Ohio', code: 'OH' }, { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' }, { name: 'Pennsylvania', code: 'PA' }, { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' }, { name: 'South Dakota', code: 'SD' }, { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' }, { name: 'Utah', code: 'UT' }, { name: 'Vermont', code: 'VT' },
  { name: 'Virginia', code: 'VA' }, { name: 'Washington', code: 'WA' }, { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' }, { name: 'Wyoming', code: 'WY' }
] as const;

// Helper to get just the state codes for Zod validation
const stateCodes = states.map(s => s.code);
// --- END STEP 1 ---

const uploadFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  files: z.custom<File[]>(
    (val) => Array.isArray(val) && val.length > 0,
    'At least one file is required.'
  ),
});

const confirmationFormSchema = z.object({
  effectiveDate: z.string().min(1, 'An effective date is required.'),
  insuranceGroup: z.string().min(1, 'Insurance group is required.'),
  state: z.enum(stateCodes as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid state' }),
  }),
});

export default function ContractUpload({ title }: ContractUploadProps) {
  // ... (All your state and handler functions remain exactly the same) ...
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [formStep, setFormStep] = useState<FormStep>('UPLOAD');
  const [pendingData, setPendingData] = useState<{ id: number | null; date: string | null }>({ id: null, date: null });
  const router = useRouter();
  const uploadForm = useForm<z.infer<typeof uploadFormSchema>>({ resolver: zodResolver(uploadFormSchema) });
  const confirmationForm = useForm<z.infer<typeof confirmationFormSchema>>({ resolver: zodResolver(confirmationFormSchema) });
  const handleInitialSubmit = async (values: z.infer<typeof uploadFormSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    values.files.forEach((file) => {
      formData.append('files', file);
    });
    try {
      const response = await postContract(formData);
      setPendingData({ id: response.id, date: response.extracted_effective_date });
      confirmationForm.setValue('effectiveDate', response.extracted_effective_date || '');
      confirmationForm.setValue('insuranceGroup', response.extracted_payer_name || '');
      confirmationForm.setValue('state', (response.extracted_state && stateCodes.includes(response.extracted_state as any)) ? response.extracted_state : '');
      setFormStep('CONFIRM_DATE');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong during upload.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFinalizeSubmit = async (values: z.infer<typeof confirmationFormSchema>) => {
    if (!pendingData.id) {
      toast.error('Cannot finalize: Missing contract ID.'); return;
    }
    setIsSubmitting(true);
    try {
      await finalizeContract({ 
        contractId: pendingData.id, 
        effectiveDate: values.effectiveDate,
        payerName: values.insuranceGroup,
        state: values.state
      });
      toast.success('Contract finalized and saved successfully!');
      setTimeout(() => { window.location.reload(); }, 1500);
      resetAndClose();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong.');
      setIsSubmitting(false);
    }
  };
  const resetAndClose = () => {
    setOpen(false);
    setTimeout(() => { 
      setFormStep('UPLOAD');
      uploadForm.reset();
      confirmationForm.reset();
      setPendingData({ id: null, date: null });
    }, 300);
  };
  // ...

  return (
    <div className={title ? 'flex justify-between items-center mx-8 lg:w-[1024px] lg:mx-auto' : ''}>
      {title && <h5>{title}</h5>}
      <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) resetAndClose(); else setOpen(true); }}>
        <DialogTrigger asChild><Button size={title ? 'default' : 'sm'} variant={title ? 'default' : 'outline'}>{title ? 'Upload contract' : '+ New Contract'}</Button></DialogTrigger>
        <DialogContent onInteractOutside={(e) => isSubmitting && e.preventDefault()}>
          {formStep === 'UPLOAD' && (
            <>
              <DialogHeader className='mb-4'>
                <DialogTitle>Upload a contract (Step 1 of 2)</DialogTitle>
                <DialogDescription>Provide the contract details and file.</DialogDescription>
              </DialogHeader>
              <Form {...uploadForm}>
                <form onSubmit={uploadForm.handleSubmit(handleInitialSubmit)} className='space-y-8'>
                  {/* ... (other fields are the same) ... */}
                  <FormField control={uploadForm.control} name='title' render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder='Enter title' {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={uploadForm.control} name='description' render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder='Write a little description...' className='resize-none' {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={uploadForm.control} name='files' render={({ field: { onChange, onBlur, name, ref } }) => ( <FormItem><FormLabel>Files (Main Contract & Amendments)</FormLabel><FormControl><Input type='file' multiple ref={ref} name={name} onBlur={onBlur} onChange={(e) => onChange(e.target.files ? Array.from(e.target.files) : [])} className='border-dashed border-blue-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border file:border-solid file:border-blue-700 file:rounded-md file:text-center file:px-2' /></FormControl><FormMessage /></FormItem> )} />
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? <Spinner /> : 'Submit'}
                  </Button>
                </form>
              </Form>
            </>
          )}
          {/* ... (The confirmation form JSX remains the same) ... */}
          {formStep === 'CONFIRM_DATE' && (
             <>
                <DialogHeader className='mb-4'><DialogTitle>Confirm Effective Date (Step 2 of 2)</DialogTitle><DialogDescription>Please review and confirm the extracted details below before finalizing.</DialogDescription></DialogHeader>
                <Form {...confirmationForm}>
                  <form onSubmit={confirmationForm.handleSubmit(handleFinalizeSubmit)} className='space-y-8'>
                    <FormField control={confirmationForm.control} name='insuranceGroup' render={({ field }) => ( <FormItem><FormLabel>Insurance Group (Payer)</FormLabel><FormControl><Input placeholder='Enter insurance group' {...field} /></FormControl><FormMessage /></FormItem> )} />
                    
                    <FormField control={confirmationForm.control} name='state' render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select your state' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((s) => (
                              <SelectItem key={s.code} value={s.code}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={confirmationForm.control} name='effectiveDate' render={({ field }) => ( <FormItem><FormLabel>Effective Date</FormLabel><FormControl><Input type='date' {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <div className='flex justify-between'><Button type='button' variant='outline' onClick={() => setFormStep('UPLOAD')} disabled={isSubmitting}>Back</Button><Button type='submit' disabled={isSubmitting}>{isSubmitting ? <Spinner /> : 'Confirm & Save Contract'}</Button></div>
                  </form>
                </Form>
             </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}