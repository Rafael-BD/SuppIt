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
import { signup, checkIfAccountExists } from '../api/backend';
import Topbar from './topBar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const Container = w('div', {
    className: 'flex items-center justify-center min-h-screen relative w-full px-4',
});

const signupFormSchema = z.object({
    name: z.string().max(20, { message: "Name must be at most 20 characters." }).min(1, { message: "Name must be at least 1 character." }),
    user: z.string().regex(/^[a-zA-Z0-9]{1,10}$/, { message: "User must be 1-10 alphanumeric characters." }),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Please enter a valid email." }),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character." }),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [availability, setAvailability] = useState({ emailExists: false, userExists: false, nameExists: false });

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            name: "",
            user: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });

    const handleSubmit = async (data: SignupFormValues): Promise<void> => {
        try {
            const body = {
                name: data.name,
                user: data.user,
                email: data.email,
                password: data.password,
            };

            const response = await checkIfAccountExists(body);
            const { emailExists, userExists, nameExists } = response.data;
            setAvailability({ emailExists, userExists, nameExists });

            if (emailExists || userExists || nameExists) {
                return;
            }

            const signupResponse = await signup(body);
            if (signupResponse.status === 201) {
                window.location.href = '/login';
            } else {
                console.error(signupResponse);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <Topbar>
                <HomeButton />
                <ThemeToggleButton />
            </Topbar>
            <Card className="mx-auto max-w-sm bg-[hsl(var(--primary-foreground))]">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Fill in the details below to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                {...form.register("name")}
                            />
                            <p className="text-xs p-1 text-red-500">{form.formState.errors.name?.message}</p>
                            {availability.nameExists && <p className="text-xs p-1 text-red-500">Name is already taken.</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="johndoe"
                                required
                                {...form.register("user")}
                            />
                            <p className="text-xs p-1 text-red-500">{form.formState.errors.user?.message}</p>
                            {availability.userExists && <p className="text-xs p-1 text-red-500">Username is already taken.</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                {...form.register("email")}
                            />
                            <p className="text-xs p-1 text-red-500">{form.formState.errors.email?.message}</p>
                            {availability.emailExists && <p className="text-xs p-1 text-red-500">Email is already taken.</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    {...form.register("password")}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                <p className="text-xs p-1 text-red-500">{form.formState.errors.password?.message}</p>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    {...form.register("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                <p className="text-xs p-1 text-red-500">{form.formState.errors.confirmPassword?.message}</p>
                            </div>
                        </div>
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </Container>
    );
}