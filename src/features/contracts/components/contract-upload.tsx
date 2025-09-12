'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/spinner';
import { postContract } from '../queries/post-contract'; // Ensure this points to the simplified postContract function

type ContractUploadProps = {
  title: string;
};

// This list of states remains the same.
const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
  'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
] as const;

// The Zod schema for form validation remains the same.
const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z
    .string()
    .min(5, { message: 'The description must be at least 5 characters.' })
    .max(160, { message: 'The description must not be longer than 160 characters.' }),
  payer_name: z.string().min(1, 'Payer name is required.'),
  state: z.enum(states),
  file: z
    .custom<File>((val) => val instanceof File, 'Must be a valid File')
    .refine((file) => file !== null && file !== undefined, 'A file is required for upload.'),
});

export default function ContractUpload({ title }: ContractUploadProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      payer_name: '',
      state: undefined,
      file: undefined,
    },
  });

  // --- THIS IS THE MODIFIED FUNCTION ---
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // 1. Create a FormData object. This is the standard way to send files
    //    and form data together in an HTTP request.
    const formData = new FormData();

    // 2. Append all the form values to the FormData object.
    //    The keys ('title', 'file', etc.) MUST match what your Django API view expects.
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('payer_name', values.payer_name);
    formData.append('state', values.state);
    formData.append('file', values.file);

    try {
      // 3. Pass the FormData object directly to the simplified postContract function.
      //    This function will send the data to your Next.js API route (/api/contracts/upload).
      await postContract(formData);

      toast.success('Contract submitted successfully!', { duration: 3000 });
      setOpen(false); // Close the dialog on success
      form.reset();   // Reset the form fields
      router.refresh(); // This tells Next.js to re-fetch Server Component data, updating the contracts list
    } catch (error: any) {
      // The error message will come from our secure API route.
      toast.error(error.message || 'Something went wrong. Please try again!', {
        duration: 3000,
      });
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false); // Ensure the submit button is re-enabled on success or failure
    }
  };
  // --- END OF MODIFICATIONS ---

  return (
    <>
      <div className='flex justify-between items-center mx-8 lg:w-[1024px] lg:mx-auto'>
        <h5>{title}</h5>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Upload contract</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className='mb-4'>
              <DialogTitle>Upload a contract</DialogTitle>
              <DialogDescription>Upload your contracts.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='space-y-8'
                // The 'enctype' is not strictly needed here since we are using fetch with FormData,
                // but it's good practice for native HTML forms with file uploads.
                encType='multipart/form-data'
              >
                {/* All of the FormField components below remain unchanged. */}
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter title' type='text' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Write a little description about your contract'
                          className='resize-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='payer_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payer Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter payer name' type='text' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select your state' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((state, i) => (
                            <SelectItem key={i} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='file'
                  // We need to remove the "value" prop from the render part for file inputs
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input
                          type='file'
                          ref={ref}
                          name={name}
                          onBlur={onBlur}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              onChange(e.target.files[0]);
                            }
                          }}
                          className='border-dashed border-blue-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border file:border-solid file:border-blue-700 file:rounded-md file:text-center file:px-2'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : 'Submit'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}