'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { w } from 'windstitch';
import HomeButton from '@/src/components/homeButton';
import ThemeToggleButton from '@/src/components/ThemeToggleButton';
import { login } from '../api/backend';
import Topbar from './topBar';

const Container = w('div', {
    className: 'flex items-center justify-center min-h-screen relative w-full px-4',
});

export function LoginForm() {

    const handleSubmit = async (): Promise<void> => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        
        try{
            const body = {
                email: email.value,
                password: password.value
            };
            const response = await login(body);
            if(response.status === 200){
                window.location.href = '/dashboard';
            } else {
                console.error(response);
            }

        } catch (error) {
            console.error(error);
        }
    };

    const handleForgotPassword = (): void => {
        // Handle forgot password logic
    };

    const handleGoogleLogin = (): void => {
        // Handle Google login logic
    };

    return (
        <Container>
            <Topbar>
                <HomeButton />
                <ThemeToggleButton />
            </Topbar>
            <Card className="mx-auto max-w-sm bg-[hsl(var(--primary-foreground))]">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input 
                                id="password" 
                                type="password" 
                                required 
                            />
                        </div>
                        <Button type="submit" className="w-full" onClick={handleSubmit}>
                            Login
                        </Button>
                        <Button variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </Container>
    );
}