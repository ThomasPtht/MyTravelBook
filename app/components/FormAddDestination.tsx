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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagsInput, TagsInputClear, TagsInputInput, TagsInputItem, TagsInputList } from "@/components/ui/tags-input"
import { Textarea } from "@/components/ui/textarea"
import { useQueryClient } from "@tanstack/react-query"
import { ImagePlus, Star } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { createDestination } from "../actions/destination"
import { uploadDestinationCover } from "../actions/destination-image"
import { formSchema } from "../schema/schemas"


export function FormAddDestination({ onClose }: { onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const [gallery, setGallery] = useState<string[]>([]);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cityName: "",
            country: "",
            status: "visited",
            visitDate: "",
            coverImage: "",
            neighborhood: [],
            overallRating: undefined,
            budget: undefined,
            food: undefined,
            safety: undefined,
            culture: undefined,
            atmosphere: undefined,
            images: [],
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            let coverImageUrl = "";
            if (values.coverImage && typeof values.coverImage !== "string") {
                const formData = new FormData();
                formData.append("file", values.coverImage);
                const result = await uploadDestinationCover(formData);
                coverImageUrl = result.url;
            } else if (typeof values.coverImage === "string") {
                coverImageUrl = values.coverImage;
            }

            let galleryImageUrls: string[] = [];
            if (values.status === "visited" && Array.isArray(gallery) && gallery.length > 0) {
                for (const dataUrl of gallery) {
                    const arr = dataUrl.split(",");
                    const match = arr[0].match(/:(.*?);/);
                    const mime = match ? match[1] : "image/png";
                    const bstr = atob(arr[1]);
                    let n = bstr.length;
                    const u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    const file = new File([u8arr], `gallery-image-${Date.now()}.png`, { type: mime });
                    const formData = new FormData();
                    formData.append("file", file);
                    const result = await uploadDestinationCover(formData);
                    galleryImageUrls.push(result.url);
                }
            }

            const destinationPayload: any = {
                ...values,
                coverImage: coverImageUrl,
            };
            if (values.status === "visited") {
                destinationPayload.images = galleryImageUrls;
            }
            delete destinationPayload.gallery;
            if (destinationPayload.images && values.status !== "visited") {
                delete destinationPayload.images;
            }
            const result = await createDestination(destinationPayload);
            setGallery([]);

            if (result.success) {
                toast.success("Destination added successfully");
                form.reset();
                await queryClient.invalidateQueries({ queryKey: ['destinations'] });
                onClose && onClose();
            } else {
                toast.error("Failed to add destination");
            }
        } catch (error) {
            toast("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    const watchStatus = form.watch("status")

    return (
        <div className="w-full max-w-lg mx-auto px-2 sm:px-0">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-lg sm:text-xl font-semibold">Add new destination</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <FormField
                            control={form.control}
                            name="cityName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm">City name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Paris" className="text-sm" {...field} />
                                    </FormControl>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs sm:text-sm">Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="France" className="text-sm" {...field} />
                                    </FormControl>
                                    <FormDescription></FormDescription>
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
                                <FormLabel className="text-xs sm:text-sm">Status</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="text-sm">
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
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Cover</FormLabel>
                                <FormControl>
                                    <div>
                                        <input
                                            id="coverUpload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    field.onChange(file);
                                                }
                                            }}
                                        />
                                        <label htmlFor="coverUpload" className="block w-full py-2 px-3 border border-dashed border-border rounded-lg cursor-pointer text-sm text-muted-foreground hover:border-foreground/50 hover:bg-muted/50 transition-colors">
                                            Click to upload cover image
                                        </label>
                                        {/* Affiche le nom du fichier sélectionné */}
                                        {field.value && typeof field.value !== "string" && field.value.name && (
                                            <span className="block mt-1 text-xs text-muted-foreground">Selected file: {field.value.name}</span>
                                        )}
                                    </div>
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {watchStatus === "visited" && (
                        <>
                            <FormField
                                control={form.control}
                                name="visitDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm">Visit date</FormLabel>
                                        <FormControl>
                                            <Input placeholder="May 2023" className="text-sm" type="text" {...field} />
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-3 rounded-lg border p-3 sm:p-4">
                                <FormField
                                    control={form.control}
                                    name="overallRating"
                                    render={({ field }) => {
                                        const [hovered, setHovered] = useState<number | null>(null);
                                        return (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm">Ratings</FormLabel>
                                                <p className="text-xs text-muted-foreground">Overall experience</p>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((star) => {
                                                        const isSelected = (field.value ?? 0) >= star;
                                                        const isHovered = hovered === star && !isSelected;
                                                        return (
                                                            <Star
                                                                key={star}
                                                                className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer transition-colors"
                                                                onMouseEnter={() => setHovered(star)}
                                                                onMouseLeave={() => setHovered(null)}
                                                                onClick={() => field.onChange(star)}
                                                                fill={isSelected ? "#BF963D" : "none"}
                                                                stroke={
                                                                    isSelected ? "" : isHovered ? "#7c4700" : "#d1d5db"
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

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {([
                                        { name: "budget" as const, label: "Budget" },
                                        { name: "food" as const, label: "Food" },
                                        { name: "safety" as const, label: "Safety" },
                                        { name: "culture" as const, label: "Culture" },
                                        { name: "atmosphere" as const, label: "Atmosphere" },
                                    ]).map(({ name, label }) => (
                                        <FormField
                                            key={name}
                                            control={form.control}
                                            name={name}
                                            render={({ field }) => {
                                                const [hovered, setHovered] = useState<number | null>(null);
                                                return (
                                                    <FormItem>
                                                        <FormLabel className="text-xs sm:text-sm">{label}</FormLabel>
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((star) => {
                                                                const isSelected = (field.value ?? 0) >= star;
                                                                const isHovered = hovered === star && !isSelected;
                                                                return (
                                                                    <Star
                                                                        key={star}
                                                                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 cursor-pointer transition-colors"
                                                                        onMouseEnter={() => setHovered(star)}
                                                                        onMouseLeave={() => setHovered(null)}
                                                                        onClick={() => field.onChange(star)}
                                                                        fill={isSelected ? "#000" : "none"}
                                                                        stroke={
                                                                            isSelected ? "" : isHovered ? "#7c4700" : "#d1d5db"
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
                                    ))}
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm">Personal notes</FormLabel>
                                        <FormControl>
                                            <Textarea className="text-sm min-h-[60px]" {...field} />
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm">Photo gallery (max 5)</FormLabel>
                                        <FormControl>
                                            <div>
                                                <div className="flex gap-2 flex-wrap mb-2">
                                                    {gallery.map((img, idx) => (
                                                        <div key={idx} className="relative">
                                                            <img src={img} alt={`preview-${idx}`} className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded" />
                                                            <button
                                                                type="button"
                                                                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs"
                                                                onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                                                            >×</button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <input
                                                    type="file"
                                                    id="photoUpload"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        if (!files) return;
                                                        const filesToProcess = Array.from(files).slice(0, 5 - gallery.length);
                                                        filesToProcess.forEach((file) => {
                                                            const reader = new FileReader();
                                                            reader.onload = (event) => {
                                                                const result = event.target?.result as string;
                                                                setGallery((prev) => [...prev, result]);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        });
                                                        e.target.value = "";
                                                    }}
                                                />
                                                <label
                                                    htmlFor="photoUpload"
                                                    className="flex flex-col items-center justify-center gap-1.5 p-4 sm:p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-foreground/50 hover:bg-muted/50 transition-colors"
                                                >
                                                    <ImagePlus className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                                                    <span className="text-xs sm:text-sm text-muted-foreground">
                                                        Click to upload photos
                                                    </span>
                                                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                                                        JPG, PNG, WebP (max 5 photos)
                                                    </span>
                                                </label>
                                            </div>
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Neighborhoods explored (comma separated)</FormLabel>
                                <FormControl>
                                    <TagsInput
                                        value={field.value || []}
                                        onValueChange={field.onChange}
                                    >
                                        <TagsInputList>
                                            {Array.isArray(field.value) && field.value.map((tag: string, idx: number) => (
                                                <TagsInputItem key={tag + idx} value={tag} />
                                            ))}
                                            <TagsInputInput placeholder="Add neighborhood..." />
                                            <TagsInputClear />
                                        </TagsInputList>
                                    </TagsInput>
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Adding..." : "Add destination"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
