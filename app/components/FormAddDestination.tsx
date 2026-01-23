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

import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { createDestination } from "../actions/destination"
import { useState } from "react"
import { formSchema } from "../schema/schemas"
import { Star } from "lucide-react"






export function FormAddDestination({ onClose }: { onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cityName: "",
            country: "",
            status: "visited",
            visitDate: "",
            coverImage: "",
            neighborhood: "",
            overallRating: undefined,
            budget: undefined,
            food: undefined,
            safety: undefined,
            culture: undefined,
            atmosphere: undefined
        }
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const result = await createDestination(values)

            if (result.success) {
                toast.success("Destination added successfully")
                form.reset()
                onClose && onClose()
            } else {
                toast.error("Failed to add destination")
            }
        } catch (error) {
            toast("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Form {...form}>
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
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="wishlist">Wishlist</SelectItem>
                                            <SelectItem value="visited">Visited</SelectItem>
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
                    name="overallRating"
                    render={({ field }) => {
                        const [hovered, setHovered] = useState<number | null>(null);

                        return (
                            <FormItem>
                                <FormLabel>Ratings</FormLabel>
                                <p>Overall experience</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isSelected = (field.value ?? 0) >= star;
                                        const isHovered = hovered === star && !isSelected;
                                        return (
                                            <Star
                                                key={star}
                                                size={24}
                                                className="cursor-pointer transition-colors"
                                                onMouseEnter={() => setHovered(star)}
                                                onMouseLeave={() => setHovered(null)}
                                                onClick={() => field.onChange(star)}
                                                fill={isSelected ? "#BF963D" : "none"}
                                                stroke={
                                                    isSelected
                                                        ? "" // marron si sélectionné
                                                        : isHovered
                                                            ? "#7c4700" // marron au hover sur non sélectionné
                                                            : "#d1d5db" // gris sinon
                                                }
                                                strokeWidth={1.5}
                                            />
                                        );
                                    })}
                                </div>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                <div className="flex gap-2">
                    <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => {
                            const [hovered, setHovered] = useState<number | null>(null);

                            return (
                                <FormItem>
                                    <FormLabel className="flex justify-center">Budget</FormLabel>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isSelected = (field.value ?? 0) >= star;
                                            const isHovered = hovered === star && !isSelected;
                                            return (
                                                <Star
                                                    key={star}
                                                    size={19}
                                                    className="cursor-pointer transition-colors"
                                                    onMouseEnter={() => setHovered(star)}
                                                    onMouseLeave={() => setHovered(null)}
                                                    onClick={() => field.onChange(star)}
                                                    fill={isSelected ? "#000" : "none"}
                                                    stroke={
                                                        isSelected
                                                            ? "" // pas de contour sélectionné
                                                            : isHovered
                                                                ? "#7c4700" // contour marron au hover sur non sélectionné
                                                                : "#d1d5db" // gris sinon
                                                    }
                                                    strokeWidth={1.5}
                                                />
                                            );
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="food"
                        render={({ field }) => {
                            const [hovered, setHovered] = useState<number | null>(null);

                            return (
                                <FormItem>
                                    <FormLabel className="flex justify-center">Food</FormLabel>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isSelected = (field.value ?? 0) >= star;
                                            const isHovered = hovered === star && !isSelected;
                                            return (
                                                <Star
                                                    key={star}
                                                    size={19}
                                                    className="cursor-pointer transition-colors"
                                                    onMouseEnter={() => setHovered(star)}
                                                    onMouseLeave={() => setHovered(null)}
                                                    onClick={() => field.onChange(star)}
                                                    fill={isSelected ? "#000" : "none"}
                                                    stroke={
                                                        isSelected
                                                            ? "" // pas de contour sélectionné
                                                            : isHovered
                                                                ? "#7c4700" // contour marron au hover sur non sélectionné
                                                                : "#d1d5db" // gris sinon
                                                    }
                                                    strokeWidth={1.5}
                                                />
                                            );
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="safety"
                        render={({ field }) => {
                            const [hovered, setHovered] = useState<number | null>(null);

                            return (
                                <FormItem>
                                    <FormLabel className="flex justify-center">Safety</FormLabel>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isSelected = (field.value ?? 0) >= star;
                                            const isHovered = hovered === star && !isSelected;
                                            return (
                                                <Star
                                                    key={star}
                                                    size={19}
                                                    className="cursor-pointer transition-colors"
                                                    onMouseEnter={() => setHovered(star)}
                                                    onMouseLeave={() => setHovered(null)}
                                                    onClick={() => field.onChange(star)}
                                                    fill={isSelected ? "#000" : "none"}
                                                    stroke={
                                                        isSelected
                                                            ? "" // pas de contour sélectionné
                                                            : isHovered
                                                                ? "#7c4700" // contour marron au hover sur non sélectionné
                                                                : "#d1d5db" // gris sinon
                                                    }
                                                    strokeWidth={1.5}
                                                />
                                            );
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="culture"
                        render={({ field }) => {
                            const [hovered, setHovered] = useState<number | null>(null);

                            return (
                                <FormItem>
                                    <FormLabel className="flex justify-center">Culture</FormLabel>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isSelected = (field.value ?? 0) >= star;
                                            const isHovered = hovered === star && !isSelected;
                                            return (
                                                <Star
                                                    key={star}
                                                    size={19}
                                                    className="cursor-pointer transition-colors"
                                                    onMouseEnter={() => setHovered(star)}
                                                    onMouseLeave={() => setHovered(null)}
                                                    onClick={() => field.onChange(star)}
                                                    fill={isSelected ? "#000" : "none"}
                                                    stroke={
                                                        isSelected
                                                            ? "" // pas de contour sélectionné
                                                            : isHovered
                                                                ? "#7c4700" // contour marron au hover sur non sélectionné
                                                                : "#d1d5db" // gris sinon
                                                    }
                                                    strokeWidth={1.5}
                                                />
                                            );
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="atmosphere"
                        render={({ field }) => {
                            const [hovered, setHovered] = useState<number | null>(null);

                            return (
                                <FormItem>
                                    <FormLabel className="flex justify-center">Budget</FormLabel>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isSelected = (field.value ?? 0) >= star;
                                            const isHovered = hovered === star && !isSelected;
                                            return (
                                                <Star
                                                    key={star}
                                                    size={19}
                                                    className="cursor-pointer transition-colors"
                                                    onMouseEnter={() => setHovered(star)}
                                                    onMouseLeave={() => setHovered(null)}
                                                    onClick={() => field.onChange(star)}
                                                    fill={isSelected ? "#000" : "none"}
                                                    stroke={
                                                        isSelected
                                                            ? "" // pas de contour sélectionné
                                                            : isHovered
                                                                ? "#7c4700" // contour marron au hover sur non sélectionné
                                                                : "#d1d5db" // gris sinon
                                                    }
                                                    strokeWidth={1.5}
                                                />
                                            );
                                        })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
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
                    name="neighborhood"
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
                    <Button type="button" variant="outline">Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Adding..." : "Add destination"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
