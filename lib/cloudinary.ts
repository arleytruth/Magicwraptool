import "server-only";

import { Readable } from "stream";
import {
    v2 as cloudinary,
    type UploadApiOptions,
    type UploadApiResponse,
} from "cloudinary";

import { serverEnv } from "@/lib/env";

cloudinary.config({
    cloud_name: serverEnv.CLOUDINARY_CLOUD_NAME,
    api_key: serverEnv.CLOUDINARY_API_KEY,
    api_secret: serverEnv.CLOUDINARY_API_SECRET,
});

type UploadSource = Buffer | Readable;

export function uploadBuffer(
    data: UploadSource,
    options: {
        folder?: string;
        filename?: string;
        resourceType?: "image" | "video" | "raw" | "auto";
        tags?: string[];
        transformation?: UploadApiOptions["transformation"];
    } = {},
) {
    const {
        folder = "magicwrap/generated",
        filename = `generated-${Date.now()}`,
        resourceType = "image",
        tags = [],
        transformation,
    } = options;

    return new Promise<UploadApiResponse>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: filename,
                resource_type: resourceType,
                overwrite: false,
                invalidate: true,
                tags,
                transformation,
            },
            (error, result) => {
                if (error || !result) {
                    return reject(error ?? new Error("Unknown Cloudinary error"));
                }
                resolve(result);
            },
        );

        if (Buffer.isBuffer(data)) {
            upload.end(data);
            return;
        }

        data.pipe(upload);
    });
}

export async function deleteAsset(publicId: string) {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
}

export const cloudinaryClient = cloudinary;
