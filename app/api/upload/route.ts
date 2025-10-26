import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { uploadBuffer } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json(
                { message: "Geçerli bir dosya gönderilmedi." },
                { status: 400 },
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const filename =
            (formData.get("filename") as string | null) ??
            `upload-${Date.now()}`;

        const uploadResult = await uploadBuffer(buffer, {
            folder: `magicwrap/users/${userId}`,
            filename,
            resourceType: "image",
        });

        return NextResponse.json({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
            bytes: uploadResult.bytes,
            format: uploadResult.format,
        });
    } catch (error) {
        console.error("[api/upload] error:", error);
        return NextResponse.json(
            { message: "Dosya yüklenirken bir hata oluştu." },
            { status: 500 },
        );
    }
}

