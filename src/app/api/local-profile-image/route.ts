import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }

  const imagePath = process.env.LOCAL_PROFILE_IMAGE_PATH;

  if (!imagePath) {
    return new Response("LOCAL_PROFILE_IMAGE_PATH is not configured", { status: 404 });
  }

  try {
    const resolvedImagePath = path.isAbsolute(imagePath) ? imagePath : path.resolve(process.cwd(), imagePath);
    const image = await readFile(resolvedImagePath);
    const extension = path.extname(resolvedImagePath).toLowerCase();
    const contentType = extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" : "image/png";

    return new Response(new Uint8Array(image), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": contentType
      }
    });
  } catch {
    return new Response("Local private profile image not found", { status: 404 });
  }
}
