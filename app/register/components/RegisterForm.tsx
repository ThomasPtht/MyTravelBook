"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";


export default function RegisterForm() {
    const formSchema = z.object({
        username: z.string().min(2, { message: "Username must be at least 2 characters." }),
        email: z.string().min(5, { message: "Please enter a valid email address." }),
        password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    // Mutation with TanStack Query
    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Registration failed");
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success("Registration successful! You can now log in.");
            console.log("Registration successful");
        },
        onError: (error: any) => {
            toast.error("Registration failed: " + error.message);
            console.error(error.message);
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutation.mutate(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex justify-center '>
                    <Button className='w-full' type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? "Creating..." : "Create Account"}

                    </Button>
                </div>

                <div className="flex justify-center mt-2">
                    <span className="text-sm text-muted-foreground">Already have an account?{' '}
                        <Link href="/login" className="text-primary font-bold hover:underline focus:underline outline-none">
                            Sign in
                        </Link>
                    </span>
                </div>


            </form>
        </Form>
    );
}