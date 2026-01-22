import { CityStatus } from "@prisma/client";
import z from "zod";


export const formSchema = z.object({
    cityName: z.string().min(2, {
        message: "Username must be at least 2 characters."
    }),
    country: z.string(),
    status: z.enum(CityStatus).optional(),
    description: z.string().optional(),
    visitDate: z.string(),
    coverImage: z.string(),
    neighborhood: z.string(),
    budget: z.number().int().optional(),
    food: z.number().int().optional(),
    safety: z.number().int().optional(),
    culture: z.number().int().optional(),
    atmosphere: z.number().int().optional()
})
