'use server'


import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { formSchema } from "../schema/schemas"
import { normalizeDestination } from "@/lib/normalizeDestination"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth";
import { ratelimit } from "@/lib/rateLimit"


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

          const { success } = await ratelimit.limit(`create_destination_${session.user.id}`);
        if (!success) {
            return { success: false, error: "Too many requests, slow down." };
        }

        const data = {
            ...normalizeDestination(validated.data),
            userId: Number(session.user.id),
        };
        // Transforme images: string[] en nested create pour Prisma
        if (data.images && Array.isArray(data.images)) {
            data.images = {
                create: data.images.map((url: string) => ({ imagePath: url })),
            };
        }
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


export async function deleteDestination(values: unknown) {

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    const { success } = await ratelimit.limit(`delete_destination_${session.user.id}`);
    if (!success) {
        return { success: false, error: "Too many requests, slow down." };
    }

    const userId = Number(session.user.id);

    const getDestination = await prisma.city.findUnique({
        where: {
            id: Number(values)
        }
    });

    if (!getDestination) {
        return {
            success: false,
            error: "Destination not found"
        }
    }

    // Vérifie que l'utilisateur est bien le propriétaire
    if (getDestination.userId !== userId) {
        return { success: false, error: "Forbidden" };
    }

    try {
        const deleteDestination = await prisma.city.delete({
            where: {
                id: Number(values)
            }
        });



        return { success: true, data: deleteDestination };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Error deleting destination" };
    }
}






