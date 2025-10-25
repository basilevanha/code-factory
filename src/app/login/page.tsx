'use client';
import AuthForm from '@/components//safety/AuthForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12 text-slate-100">
      <AuthForm />
    </main>
  );
}
