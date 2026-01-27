'use server'


import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { formSchema } from "../schema/schemas"
import { normalizeDestination } from "@/lib/normalizeDestination"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"

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

        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const data = {
            ...normalizeDestination(validated.data),
            userId: Number(session.user.id),
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






