'use client';
import React, { useState } from 'react';
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
import HomeButton from '@/src/components/home-btn';
import ThemeToggleButton from '@/src/components/ThemeToggle-btn';
import { login, checkIfAccountExists } from '../api/backend';
import Topbar from './topBar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Container = w('div', {
    className: 'flex items-center justify-center min-h-screen relative w-full px-4',
});

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (): Promise<void> => {
        try {
            const body = {
                email,
                password,
            };
            const response = await login(body);
            if (response.status === 200) {
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" onClick={handleSubmit}>
                            Login
                        </Button>
                        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
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