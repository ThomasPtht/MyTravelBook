"use server"

import { uploadFileToS3 } from "@/lib/r-2-upload";

export const uploadDestinationCover = async (formData: FormData) => {
    const result = await uploadFileToS3(formData);
    return result;
};