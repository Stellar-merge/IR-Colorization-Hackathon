import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const pythonApiUrl = process.env.PYTHON_API_URL || "http://127.0.0.1:8000/predict";
    
    try {
      // Forward the upload request to the FastAPI Python server
      const backendResponse = await fetch(pythonApiUrl, {
        method: "POST",
        body: formData,
        // Set a reasonable timeout so we don't hang indefinitely if Python is loading a huge model
        signal: AbortSignal.timeout(30000), 
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return NextResponse.json(data);
      } else {
        const errorText = await backendResponse.text();
        console.warn(`[API] Python backend returned error status ${backendResponse.status}: ${errorText}`);
      }
    } catch (fetchError) {
      console.warn(
        `[API] Could not connect to Python backend at ${pythonApiUrl}. Falling back to demo mode.`,
        fetchError
      );
    }

    // Fallback Mock Mode: Simulate 4-second inference time and return placeholders
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return NextResponse.json({
      images: {
        enhanced: "/placeholder-enhanced.jpg",
        generated: "/placeholder-generated.jpg",
      },
      metrics: {
        psnr: 34.8,
        ssim: 0.947,
        fid: 19.4,
        inferenceTime: 0.86,
        isDemoFallback: true,
      }
    });

  } catch (error) {
    console.error("[API] Critical error in Next.js inference route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
