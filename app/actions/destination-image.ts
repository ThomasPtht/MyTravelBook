"use server"

import { uploadFileToS3 } from "@/lib/r-2-upload";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const uploadDestinationCover = async (formData: FormData) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        throw new Error("Unauthorized");
    }

    const result = await uploadFileToS3(formData);
    return result;
};