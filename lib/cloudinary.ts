import "server-only";

import { Readable } from "stream";
import {
    v2 as cloudinary,
    type UploadApiOptions,
    type UploadApiResponse,
} from "cloudinary";

// Lazy-load Cloudinary config to avoid build-time errors
let cloudinaryConfigured = false;

const ensureCloudinaryConfigured = () => {
    if (cloudinaryConfigured) return;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("Missing Cloudinary environment variables");
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });

    cloudinaryConfigured = true;
};

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
    // Ensure Cloudinary is configured before using
    ensureCloudinaryConfigured();

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
    // Ensure Cloudinary is configured before using
    ensureCloudinaryConfigured();
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
}

export const cloudinaryClient = cloudinary;
