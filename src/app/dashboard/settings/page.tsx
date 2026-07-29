'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Sun, Moon, Laptop, Lock, Bell, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/password-input';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Notification toggles state
  const [notifications, setNotifications] = useState({
    contractUpdates: true,
    rateAlerts: true,
    systemAnnouncements: false,
  });

  useEffect(() => {
    setMounted(true);

    const savedNotifs = localStorage.getItem('userNotifications');
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onPasswordSubmit = (_data: PasswordFormValues) => {
    toast.success('Password updated successfully!');
    passwordForm.reset();
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('userNotifications', JSON.stringify(updated));
    toast.success('Notification preferences saved.');
  };

  if (!mounted) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground text-sm">
          Customize your workspace appearance, security, and notification preferences.
        </p>
      </div>

      {/* Theme / Appearance Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b pb-3 font-semibold">
          <Sun className="h-5 w-5 text-primary" />
          <span>Appearance & Theme</span>
        </div>

        <p className="text-xs text-muted-foreground">
          Choose how NGA CMS looks to you. Select a preference below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center justify-between rounded-lg border-2 p-4 transition-all hover:border-primary/50 text-left ${
              theme === 'light'
                ? 'border-primary bg-primary/5 font-semibold text-primary'
                : 'border-muted bg-popover'
            }`}
          >
            <div className="flex items-center gap-2 w-full mb-3">
              <Sun className="h-5 w-5" />
              <span>Light Mode</span>
              {theme === 'light' && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className="w-full h-12 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-500">
              Clean Light Preview
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center justify-between rounded-lg border-2 p-4 transition-all hover:border-primary/50 text-left ${
              theme === 'dark'
                ? 'border-primary bg-primary/5 font-semibold text-primary'
                : 'border-muted bg-popover'
            }`}
          >
            <div className="flex items-center gap-2 w-full mb-3">
              <Moon className="h-5 w-5" />
              <span>Dark Mode</span>
              {theme === 'dark' && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className="w-full h-12 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-400">
              Sleek Dark Preview
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`flex flex-col items-center justify-between rounded-lg border-2 p-4 transition-all hover:border-primary/50 text-left ${
              theme === 'system'
                ? 'border-primary bg-primary/5 font-semibold text-primary'
                : 'border-muted bg-popover'
            }`}
          >
            <div className="flex items-center gap-2 w-full mb-3">
              <Laptop className="h-5 w-5" />
              <span>System Default</span>
              {theme === 'system' && <Check className="h-4 w-4 ml-auto" />}
            </div>
            <div className="w-full h-12 rounded bg-gradient-to-r from-slate-100 to-slate-900 border flex items-center justify-center text-xs text-slate-500">
              Auto Switch
            </div>
          </button>
        </div>
      </div>

      {/* Security & Password Reset Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b pb-3 font-semibold">
          <Lock className="h-5 w-5 text-primary" />
          <span>Security & Password Reset</span>
        </div>

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <PasswordInput
              id="currentPassword"
              {...passwordForm.register('currentPassword')}
              placeholder="••••••••"
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-xs text-destructive">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput
              id="newPassword"
              {...passwordForm.register('newPassword')}
              placeholder="••••••••"
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-xs text-destructive">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <PasswordInput
              id="confirmPassword"
              {...passwordForm.register('confirmPassword')}
              placeholder="••••••••"
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
            Update Password
          </Button>
        </form>
      </div>

      {/* Notification Preferences Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b pb-3 font-semibold">
          <Bell className="h-5 w-5 text-primary" />
          <span>Notification Preferences</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Contract Upload & Status Updates</p>
              <p className="text-xs text-muted-foreground">Receive email alerts when contracts are parsed or updated.</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.contractUpdates}
              onChange={() => toggleNotification('contractUpdates')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <div>
              <p className="text-sm font-medium">Rate Benchmarking & CPT Code Alerts</p>
              <p className="text-xs text-muted-foreground">Notifications for rate changes and fee schedule shifts.</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.rateAlerts}
              onChange={() => toggleNotification('rateAlerts')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <div>
              <p className="text-sm font-medium">System Announcements</p>
              <p className="text-xs text-muted-foreground">Product updates and scheduled maintenance news.</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.systemAnnouncements}
              onChange={() => toggleNotification('systemAnnouncements')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
