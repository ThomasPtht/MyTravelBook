'use server'


import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { formSchema } from "../schema/schemas"

export async function createDestination(values: unknown) {
    const validated = formSchema.safeParse(values)


    if (!validated.success) {
        return {
            success: false,
            error: "Validation failed",
            details: validated.error
        }
    }
    try {

        const data = {
            ...validated.data,
            status: validated.data.status ?? "visited",
            coverImage: validated.data.coverImage ?? "",
            description: validated.data.description ?? "",
            budget: validated.data.budget ?? 0,
            overallRating: validated.data.overallRating ?? 0,
            food: validated.data.food ?? 0,
            safety: validated.data.safety ?? 0,
            culture: validated.data.culture ?? 0,
            atmosphere: validated.data.atmosphere ?? 0,
            neighborhood: typeof validated.data.neighborhood === "string"
                ? validated.data.neighborhood.split(',').map((n: string) => n.trim())
                : validated.data.neighborhood,
            visitDate: validated.data.visitDate ?? ""
        };

        const newDestination = await prisma.city.create({
            data
        });
        revalidatePath("/");
        return { success: true, data: newDestination };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Error creating destination" };
    }

}






