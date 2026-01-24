import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
    region: "auto", // Pour Cloudflare R2
    endpoint: process.env.AWS_S3_API_URL ?? "",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
});

export const uploadFileToS3 = async (formData: FormData) => {
    const file = formData.get("file");

    if (!(file instanceof File)) {
        throw new Error("No file provided");
    }

    if (file.size > 2 * 1024 * 1024) {
        throw new Error("File size must be less than 2MB");
    }

    // Convertir le fichier en buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${uuidv4()}-${file.name}`;

    // Upload vers R2
    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        })
    );

    // Générer l'URL publique
    const url = `${process.env.R2_URL}/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
    return { url };
};