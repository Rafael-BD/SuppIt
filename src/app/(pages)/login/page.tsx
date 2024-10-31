'use client';
import * as React from 'react';
import  { LoginForm } from '@/src/components/login-form';

export default function LoginPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4 bg-[hsl(var(--background))]">
            <LoginForm />
        </div>
    );
}