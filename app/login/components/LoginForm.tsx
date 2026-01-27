import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function LoginForm() {

    const router = useRouter();

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
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Login failed");
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success("Login successful! Welcome back.");
            router.push("/");
            console.log("Login successful");
        },
        onError: (error: any) => {
            toast.error("Login failed: " + error.message);
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
                        {mutation.isPending ? "Loading..." : "Login"}
                    </Button>
                </div>
                <Link href="/register" className="text-sm text-primary hover:underline flex justify-center">
                    <p>Register</p>
                </Link>

            </form>
        </Form>
    );
}