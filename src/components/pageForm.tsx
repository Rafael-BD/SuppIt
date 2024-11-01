'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "./ui/toast";
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
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

const imageFile = z.instanceof(File).refine(file => file.type.startsWith("image/"), {
    message: "File must be an image.",
});

const pageFormSchema = z.object({
    description: z.string().optional(),
    profile_img: imageFile.optional(),
    banner_img: imageFile.optional(),
    urls: z.array(z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
    })).optional(),
});
type PageFormValues = z.infer<typeof pageFormSchema>;

export function PageForm() {
    const { toast } = useToast();
    const [profileImgPreview, setProfileImgPreview] = useState<string | null>(null);
    const [bannerImgPreview, setBannerImgPreview] = useState<string | null>(null);

    const form = useForm<PageFormValues>({
        resolver: zodResolver(pageFormSchema),
        defaultValues: {
            description: "",
            profile_img: undefined,
            banner_img: undefined,
            urls: [],
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        name: "urls",
        control: form.control,
    });

    function onSubmit(data: PageFormValues) {
        // Remove empty URLs before submitting
        data.urls = data.urls?.filter(url => url.value.trim() !== "") || [];
        // Display toast notification
        toast({
            title: "Page Updated",
        });
    }

    function handleProfileImgChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setProfileImgPreview(URL.createObjectURL(file));
            form.setValue("profile_img", file);
        }
    }

    function handleBannerImgChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setBannerImgPreview(URL.createObjectURL(file));
            form.setValue("banner_img", file);
        }
    }

    function handleAddUrl() {
        if (fields.length === 0) {
            append({ value: "" });
        } else {
            const lastUrl = form.getValues(`urls.${fields.length - 1}.value`);
            if (lastUrl && lastUrl.trim() !== "") {
                append({ value: "" });
            } else {
                form.setError(`urls.${fields.length - 1}.value`, {
                    type: "manual",
                    message: "Please enter a valid URL before adding another.",
                });
            }
        }
    }

    return (
        <ToastProvider>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Tell us a little bit about your page" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="profile_img"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Image</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/*" onChange={handleProfileImgChange} />
                                </FormControl>
                                {profileImgPreview && <img src={profileImgPreview} alt="Profile Preview" className="mt-2 h-20 w-20 object-cover" />}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="banner_img"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Banner Image</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/*" onChange={handleBannerImgChange} />
                                </FormControl>
                                {bannerImgPreview && <img src={bannerImgPreview} alt="Banner Preview" className="mt-2 h-20 w-80 object-cover" />}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        {fields.map((field, index) => (
                            <FormField
                                control={form.control}
                                key={field.id}
                                name={`urls.${index}.value`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={index !== 0 ? "sr-only" : ""}>
                                            URLs
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex items-center space-x-2">
                                                <Input {...field} />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                >
                                                    <FiTrash2 />
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={handleAddUrl}
                        >
                            Add URL
                        </Button>
                    </div>
                    <Button type="submit">Update Page</Button>
                </form>
            </Form>
            <ToastViewport />
        </ToastProvider>
    );
}