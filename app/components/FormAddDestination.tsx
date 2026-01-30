"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
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
import { useEffect, useState } from "react"
import { formSchema } from "../schema/schemas"
import { ImagePlus, RefreshCcw, Star } from "lucide-react"
import { uploadDestinationCover } from "../actions/destination-image"
import { TagsInput, TagsInputClear, TagsInputInput, TagsInputItem, TagsInputList } from "@/components/ui/tags-input"






export function FormAddDestination({ onClose }: { onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const [gallery, setGallery] = useState<string[]>([]);


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
            // Upload cover image if needed
            if (values.coverImage && typeof values.coverImage !== "string") {
                const formData = new FormData();
                formData.append("file", values.coverImage);
                const result = await uploadDestinationCover(formData);
                coverImageUrl = result.url;
            } else if (typeof values.coverImage === "string") {
                coverImageUrl = values.coverImage;
            }

            // Upload gallery images (DataURL -> File -> upload) uniquement si status = 'visited' et gallery local non vide
            let galleryImageUrls: string[] = [];
            if (values.status === "visited" && Array.isArray(gallery) && gallery.length > 0) {
                for (const dataUrl of gallery) {
                    // Convert DataURL to Blob
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
                    const result = await uploadDestinationCover(formData); // Utilise la même fonction d'upload
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
            // Supprime tout champ contenant des DataURL ou le state local gallery
            delete destinationPayload.gallery;
            // Supprime aussi tout champ images s'il n'est pas une liste d'URL (sécurité)
            if (destinationPayload.images && values.status !== "visited") {
                delete destinationPayload.images;
            }
            const result = await createDestination(destinationPayload);
            setGallery([]); // Vide la mémoire après soumission

            if (result.success) {
                toast.success("Destination added successfully");
                form.reset();
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
        <div className="max-h-[80vh] overflow-y-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <h2 className="text-lg font-medium">Add new destination</h2>
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
                                        <SelectTrigger className="w-45">
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
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                field.onChange(file); // Stocke le fichier dans le form
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>

                                </FormDescription>
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


                            <div className="p-4 bg-neutral-50 border-2 rounded-lg">
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

                                <div className="flex gap-2 mt-5">
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
                                                    <FormLabel className="flex justify-center">Atmosphere</FormLabel>
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
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Personal notes</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Share your experience..." {...field} />
                                        </FormControl>
                                        <FormDescription>

                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Photo gallery (max 5)</FormLabel>
                                        <FormControl>
                                            <>
                                                {/* Affichage des miniatures */}
                                                <div className="flex gap-2 mb-2">
                                                    {gallery.map((img, idx) => (
                                                        <div key={idx} className="relative">
                                                            <img src={img} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded" />
                                                            <button
                                                                type="button"
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                                onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                                                            >×</button>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Input d'upload */}
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
                                                    className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-foreground/50 hover:bg-muted/50 transition-colors"
                                                >
                                                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">
                                                        Click to upload photos
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        JPG, PNG, WebP (max 5 photos)
                                                    </span>
                                                </label>
                                            </>
                                        </FormControl>
                                        <FormDescription>
                                        </FormDescription>
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
                                <FormLabel>Neighborhoods explored</FormLabel>
                                <FormControl>
                                    <TagsInput
                                        value={Array.isArray(field.value) ? field.value : field.value ? [field.value] : []}
                                        onValueChange={field.onChange}
                                        editable
                                        addOnPaste
                                    >

                                        <TagsInputList>
                                            {(Array.isArray(field.value) ? field.value : field.value ? [field.value] : []).map((neigh) => (
                                                <TagsInputItem key={neigh} value={neigh}>
                                                    {neigh}
                                                </TagsInputItem>
                                            ))}
                                            <TagsInputInput placeholder="Add neighborhood..." />
                                        </TagsInputList>
                                        <TagsInputClear asChild>
                                            <Button variant="outline">
                                                <RefreshCcw className="h-4 w-4" />
                                                Clear
                                            </Button>
                                        </TagsInputClear>
                                    </TagsInput>
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
        </div >
    )
}
