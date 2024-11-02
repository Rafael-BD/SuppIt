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
import { updateAccount, fetchAccountData, checkIfAccountExists } from "../api/backend";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";

const profileFormSchema = z.object({
    name: z.string().max(20, { message: "Name must be at most 20 characters." }).min(1, { message: "Name must be at least 1 character." }),
    user: z.string().regex(/^[a-zA-Z0-9]{1,10}$/, { message: "User must be 1-10 alphanumeric characters." }),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Please enter a valid email." }),
    oldPassword: z.union([z.string(), z.literal("")]).optional(),
    newPassword: z.union([z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "New password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character." }), z.literal("")]).optional(),
    confirmPassword: z.union([z.string(), z.literal("")]).optional(),
}).refine(data => !data.newPassword || data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
    const { toast } = useToast();
    const [availability, setAvailability] = useState({ emailExists: false, userExists: false, nameExists: false });
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: "",
            user: "",
            email: "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await fetchAccountData();
            console.log(data);
            form.reset(data);
        };
        fetchProfile();
    }, [form]);

    async function onSubmit(data: ProfileFormValues) {
        const response = await checkIfAccountExists({
            email: data.email,
            user: data.user,
            name: data.name,
        });
        const { emailExists, userExists, nameExists } = response.data;
        setAvailability({ emailExists, userExists, nameExists });

        if (emailExists || userExists || nameExists) {
            return;
        }
        const updateResponse = await updateAccount({
            name: data.name,
            email: data.email,
            user: data.user,
            oldPassword: data.oldPassword || "",
            newPassword: data.newPassword || "",
            confirmPassword: data.confirmPassword || "",
        });

        if (updateResponse.status === 200) {
            toast({
                title: "Profile Updated",
            });
        } else {
            console.error(updateResponse);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                color: "error",
            });
        }
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
                                {availability.nameExists && <p className="text-red-500">Name is already taken.</p>}
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
                                {availability.userExists && <p className="text-red-500">User is already taken.</p>}
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
                                {availability.emailExists && <p className="text-red-500">Email is already taken.</p>}
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <FormField
                        control={form.control}
                        name="oldPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Old Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
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