'use server'


import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { formSchema } from "../schema/schemas"
import { normalizeDestination } from "@/lib/normalizeDestination"

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

        const data = normalizeDestination(validated.data)

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






