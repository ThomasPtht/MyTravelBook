"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CityStatus } from "../generated/prisma/enums"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"





const formSchema = z.object({
    cityName: z.string().min(2, {
        message: "Username must be at least 2 characters."
    }),
    country: z.string(),
    status: z.enum(CityStatus),
    visitDate: z.string(),
    coverImage: z.string(),
    neighborhood: z.string(),
    budget: z.int(),
    food: z.int(),
    safety: z.int(),
    culture: z.int(),
    atmosphere: z.int(),
    createdAt: z.date(),
    updatedAt: z.date()
})

export function FormAddDestination() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cityName: "",
            country: "",
            status: undefined,
            visitDate: "",
            coverImage: "",
            neighborhood: "",
            budget: undefined,
            food: undefined,
            safety: undefined,
            culture: undefined,
            atmosphere: undefined,
            createdAt: undefined,
            updatedAt: undefined
        }
    })


    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
    }



    return (
        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="cityName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Paris" {...field} />
                                </FormControl>
                                <FormDescription>

                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input placeholder="France" {...field} />
                                </FormControl>
                                <FormDescription>

                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Fruits</SelectLabel>
                                            <SelectItem value="apple">Apple</SelectItem>

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cover</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="visitDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Visit date</FormLabel>
                            <FormControl>
                                <Input placeholder="May 2024" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />







                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Personal notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Share your experience" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Neighborhoods</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-2 justify-end">
                    <Button variant="outline">Cancel</Button>
                    <Button type="submit">Add destination</Button>
                </div>
            </form>
        </Form>
    )
}
