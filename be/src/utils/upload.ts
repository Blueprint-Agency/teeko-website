import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_S3_API,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

export const uploadImageToR2 = async (file: Express.Multer.File, folder: string = "blogs"): Promise<string> => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const key = `${folder}/${fileName}`;

    await s3Client.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        })
    );

    // According to user report, the path needs the bucket name
    return `${process.env.R2_PUBLIC_URL}/${process.env.R2_BUCKET_NAME}/${key}`;
};

// Legacy placeholder - will be removed once all controllers are updated
export const uploadImage = async (file: any): Promise<string> => {
    return `https://placehold.co/600x400?text=Uploaded+Image`;
};
