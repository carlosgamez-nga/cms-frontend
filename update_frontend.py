import re

filepath = "/Users/ngauser/Documents/GitHub/cms-frontend/src/features/contracts/components/contract-upload.tsx"
with open(filepath, "r") as f:
    content = f.read()

# 1. Update schemas
old_schemas = """const uploadFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  payer_name: z.string().min(1, 'Payer name is required.'),
  // --- STEP 2: Update the Zod schema to validate against the two-letter codes ---
  state: z.enum(stateCodes),
  // --- END STEP 2 ---
  file: z.custom<File>((val) => val instanceof File, 'Must be a valid File').refine((file) => file != null, 'A file is required.'),
});

const confirmationFormSchema = z.object({
  effectiveDate: z.string().min(1, 'An effective date is required.'),
});"""

new_schemas = """const uploadFormSchema = z.object({
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
  state: z.enum(stateCodes, {
    errorMap: () => ({ message: 'Please select a valid state' }),
  }),
});"""

content = content.replace(old_schemas, new_schemas)

# 2. Update handleInitialSubmit
old_initial = """  const handleInitialSubmit = async (values: z.infer<typeof uploadFormSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value as string | File);
    });
    try {
      const response = await postContract(formData);
      setPendingData({ id: response.id, date: response.extracted_effective_date_from_file });
      confirmationForm.setValue('effectiveDate', response.extracted_effective_date_from_file || '');
      setFormStep('CONFIRM_DATE');"""

new_initial = """  const handleInitialSubmit = async (values: z.infer<typeof uploadFormSchema>) => {
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
      setFormStep('CONFIRM_DATE');"""

content = content.replace(old_initial, new_initial)

# 3. Update handleFinalizeSubmit
old_finalize = """      await finalizeContract({ contractId: pendingData.id, effectiveDate: values.effectiveDate });"""
new_finalize = """      await finalizeContract({ 
        contractId: pendingData.id, 
        effectiveDate: values.effectiveDate,
        payerName: values.insuranceGroup,
        state: values.state
      });"""

content = content.replace(old_finalize, new_finalize)

# 4. Remove payer_name and state from UPLOAD form
old_form_fields = """                  <FormField control={uploadForm.control} name='title' render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder='Enter title' {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={uploadForm.control} name='description' render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder='Write a little description...' className='resize-none' {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={uploadForm.control} name='payer_name' render={({ field }) => ( <FormItem><FormLabel>Payer Name</FormLabel><FormControl><Input placeholder='Enter payer name' {...field} /></FormControl><FormMessage /></FormItem> )} />
                  
                  {/* --- STEP 3: Update the Select component in the JSX --- */}
                  <FormField
                    control={uploadForm.control}
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
                            {/* Map over the array of objects now */}
                            {states.map((state) => (
                              // Use the code for the value, and the name for the display
                              <SelectItem key={state.code} value={state.code}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* --- END STEP 3 --- */}

                  <FormField control={uploadForm.control} name='file' render={({ field: { onChange, onBlur, name, ref } }) => ( <FormItem><FormLabel>File</FormLabel><FormControl><Input type='file' ref={ref} name={name} onBlur={onBlur} onChange={(e) => onChange(e.target.files?.[0])} className='border-dashed border-blue-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border file:border-solid file:border-blue-700 file:rounded-md file:text-center file:px-2' /></FormControl><FormMessage /></FormItem> )} />"""

new_form_fields = """                  <FormField control={uploadForm.control} name='title' render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder='Enter title' {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={uploadForm.control} name='description' render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder='Write a little description...' className='resize-none' {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={uploadForm.control} name='files' render={({ field: { onChange, onBlur, name, ref } }) => ( <FormItem><FormLabel>Files (Main Contract & Amendments)</FormLabel><FormControl><Input type='file' multiple ref={ref} name={name} onBlur={onBlur} onChange={(e) => onChange(e.target.files ? Array.from(e.target.files) : [])} className='border-dashed border-blue-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border file:border-solid file:border-blue-700 file:rounded-md file:text-center file:px-2' /></FormControl><FormMessage /></FormItem> )} />"""

content = content.replace(old_form_fields, new_form_fields)

# 5. Add insuranceGroup and state to CONFIRM_DATE form
old_confirm = """<Form {...confirmationForm}><form onSubmit={confirmationForm.handleSubmit(handleFinalizeSubmit)} className='space-y-8'><FormField control={confirmationForm.control} name='effectiveDate' render={({ field }) => ( <FormItem><FormLabel>Effective Date</FormLabel><FormControl><Input type='date' {...field} /></FormControl><FormMessage /></FormItem> )} /><div className='flex justify-between'><Button type='button' variant='outline' onClick={() => setFormStep('UPLOAD')} disabled={isSubmitting}>Back</Button><Button type='submit' disabled={isSubmitting}>{isSubmitting ? <Spinner /> : 'Confirm & Save Contract'}</Button></div></form></Form>"""

new_confirm = """<Form {...confirmationForm}>
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
                </Form>"""

content = content.replace(old_confirm, new_confirm)

# Fix DialogDescription to match the new flow
old_desc = """<DialogDescription>{pendingData.date ? `We extracted the date below. Please confirm it's correct or enter the right one.` : `We couldn't find an effective date. Please enter it below.`}</DialogDescription>"""
new_desc = """<DialogDescription>Please review and confirm the extracted details below before finalizing.</DialogDescription>"""
content = content.replace(old_desc, new_desc)


with open(filepath, "w") as f:
    f.write(content)

print("Updated contract-upload.tsx")
