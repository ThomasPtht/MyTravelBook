
import z from "zod";


export const CityStatus = ["visited", "wishlist"] as const;

export const formSchema = z.object({
    cityName: z.string().min(2, {
        message: "Username must be at least 2 characters."
    }),
    country: z.string(),
    status: z.enum(CityStatus),
    description: z.string().optional(),
    visitDate: z.string(),
    coverImage: z.string(),
    neighborhood: z.string(),
    overallRating: z.number().int(),
    budget: z.number().int(),
    food: z.number().int(),
    safety: z.number().int(),
    culture: z.number().int(),
    atmosphere: z.number().int()
})
