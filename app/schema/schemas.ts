import { z } from "zod";

const wishlistSchema = z.object({
    cityName: z.string().min(2),
    country: z.string(),
    status: z.literal("wishlist"),
    coverImage: z.union([z.string(), z.instanceof(File)]),
    neighborhood: z.array(z.string()).optional(),
});

const visitedSchema = wishlistSchema.extend({
    status: z.literal("visited"),
    visitDate: z.string(),
    overallRating: z.number().int(),
    budget: z.number().int(),
    food: z.number().int(),
    safety: z.number().int(),
    culture: z.number().int(),
    atmosphere: z.number().int(),
    description: z.string().optional(),
    images: z.array(z.union([z.string(), z.instanceof(File)])),
});

export const formSchema = z.discriminatedUnion("status", [
    wishlistSchema,
    visitedSchema,
]);