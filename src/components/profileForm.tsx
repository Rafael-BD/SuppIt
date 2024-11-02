'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastProvider, ToastViewport } from "./ui/toast";
import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";
import { updateAccount, fetchAccountData } from "../api/backend";
import { useEffect } from "react";

const profileFormSchema = z.object({
    name: z.string().max(20, { message: "Name must be at most 20 characters." }),
    user: z.string().regex(/^[a-zA-Z0-9]{1,10}$/, { message: "User must be 1-10 alphanumeric characters." }),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Please enter a valid email." }),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
    const { toast } = useToast();
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: "",
            user: "",
            email: "",
            password: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await fetchAccountData();
            form.reset(data);
        };
        fetchProfile();
    }, [form]);

    async function onSubmit(data: ProfileFormValues) {
        toast({
            title: "Profile Updated",
        });
        console.log(data);
        await updateAccount(data);
    }

    return (
        <ToastProvider>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="user"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User</FormLabel>
                                <FormControl>
                                    <Input placeholder="johndoe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Update Profile</Button>
                </form>
            </Form>
            <ToastViewport />
        </ToastProvider>
    );
}