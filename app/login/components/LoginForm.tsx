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
import { signIn } from 'next-auth/react';

export default function LoginForm() {

    const router = useRouter();

    const formSchema = z.object({
        email: z.string().min(5, { message: "Please enter a valid email address." }),
        password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });
        console.log(res);
        if (res?.ok) {
            toast.success("Login successful! Welcome back.");
            router.push("/");
        } else {
            toast.error("Login failed: credentials are incorrect.");
        }
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
                    <Button className='w-full' type="submit">
                        Login
                    </Button>
                </div>
                <Link href="/register" className="text-sm text-primary hover:underline flex justify-center">
                    <p>Register</p>
                </Link>

            </form>
        </Form>
    );
}