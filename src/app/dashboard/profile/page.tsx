'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Building2, MapPin, Stethoscope, Save, RotateCcw } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
];

const SPECIALTIES = [
  'Gastroenterology',
  'Cardiology',
  'Primary Care / Internal Medicine',
  'Orthopedics',
  'General Surgery',
  'Neurology',
  'Oncology',
  'Pediatrics',
  'Radiology',
  'Other',
];

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  practiceName: z.string().min(2, 'Practice name is required'),
  state: z.string().min(1, 'Please select a state'),
  county: z.string().min(1, 'County is required'),
  specialty: z.string().min(1, 'Please select a specialty'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [loaded, setLoaded] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'Dr. Alex Taylor',
      email: 'alex.taylor@ngahealth.com',
      practiceName: 'Digestive Health Associates',
      state: 'Georgia',
      county: 'Fulton',
      specialty: 'Gastroenterology',
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting, isDirty } } = form;

  useEffect(() => {
    const savedName = localStorage.getItem('userName') || 'Dr. Alex Taylor';
    const savedEmail = localStorage.getItem('userEmail') || 'alex.taylor@ngahealth.com';
    const savedPractice = localStorage.getItem('practiceName') || 'Digestive Health Associates';
    const savedState = localStorage.getItem('userState') || 'Georgia';
    const savedCounty = localStorage.getItem('userCounty') || 'Fulton';
    const savedSpecialty = localStorage.getItem('userSpecialty') || 'Gastroenterology';

    reset({
      name: savedName,
      email: savedEmail,
      practiceName: savedPractice,
      state: savedState,
      county: savedCounty,
      specialty: savedSpecialty,
    });
    setLoaded(true);
  }, [reset]);

  const onSubmit = (data: ProfileFormValues) => {
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('practiceName', data.practiceName);
    localStorage.setItem('userState', data.state);
    localStorage.setItem('userCounty', data.county);
    localStorage.setItem('userSpecialty', data.specialty);

    window.dispatchEvent(new Event('user-profile-updated'));

    toast.success('Profile updated successfully!');
    reset(data);
  };

  const watchName = watch('name');
  const watchSpecialty = watch('specialty');
  const watchState = watch('state');

  const initials = watchName
    ? watchName.match(/(\b\S)?/g)?.join('').substring(0, 2).toUpperCase()
    : 'AT';

  if (!loaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile Information</h1>
        <p className="text-muted-foreground text-sm">
          Manage your personal details and healthcare practice settings.
        </p>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <Avatar className="h-20 w-20 rounded-full border-2 border-primary/20 bg-primary/10">
          <AvatarFallback className="text-xl font-bold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <h2 className="text-xl font-semibold">{watchName}</h2>
          <p className="text-sm text-muted-foreground">{watch('email')}</p>
          <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
              <Stethoscope className="h-3 w-3" /> {watchSpecialty}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <MapPin className="h-3 w-3" /> {watchState}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Details Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 font-semibold">
            <User className="h-5 w-5 text-primary" />
            <span>Personal Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register('name')} placeholder="Dr. Jane Doe" />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register('email')} placeholder="jane.doe@example.com" />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Practice Details Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3 font-semibold">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Practice & Medical Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="practiceName">Practice Name</Label>
              <Input id="practiceName" {...register('practiceName')} placeholder="Practice Name" />
              {errors.practiceName && (
                <p className="text-xs text-destructive">{errors.practiceName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={watch('state')}
                onValueChange={(val) => setValue('state', val, { shouldDirty: true })}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-xs text-destructive">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="county">County</Label>
              <Input id="county" {...register('county')} placeholder="e.g. Fulton" />
              {errors.county && (
                <p className="text-xs text-destructive">{errors.county.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="specialty">Medical Specialty</Label>
              <Select
                value={watch('specialty')}
                onValueChange={(val) => setValue('specialty', val, { shouldDirty: true })}
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Select Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialty && (
                <p className="text-xs text-destructive">{errors.specialty.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || isSubmitting}
            onClick={() => {
              const currentValues = {
                name: localStorage.getItem('userName') || 'Dr. Alex Taylor',
                email: localStorage.getItem('userEmail') || 'alex.taylor@ngahealth.com',
                practiceName: localStorage.getItem('practiceName') || 'Digestive Health Associates',
                state: localStorage.getItem('userState') || 'Georgia',
                county: localStorage.getItem('userCounty') || 'Fulton',
                specialty: localStorage.getItem('userSpecialty') || 'Gastroenterology',
              };
              reset(currentValues);
              toast.info('Form reset to saved values.');
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
