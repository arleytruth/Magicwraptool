import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getVideoGeneration } from "@/lib/supabase/video-generations";

export const runtime = "nodejs";

// GET - Get specific video generation
export async function GET(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const videoGeneration = await getVideoGeneration(params.id);

        if (!videoGeneration) {
            return NextResponse.json(
                { message: "Video bulunamadı" },
                { status: 404 },
            );
        }

        return NextResponse.json(videoGeneration);
    } catch (error) {
        console.error("[api/videos/[id]] GET error:", error);
        return NextResponse.json(
            { message: "Video yüklenirken bir hata oluştu." },
            { status: 500 },
        );
    }
}

