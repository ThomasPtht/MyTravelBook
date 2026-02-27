import { z } from "zod";
import { validatePassword } from "@/lib/passwordValidation";

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

export const registerSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters." })
        .refine(
            validatePassword,
            {
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            }
        ),
});