import imageCompression from "browser-image-compression";
import type { Options } from "browser-image-compression";

// 500KB / 800px — backend re-encodes to 400×400 JPEG; 2× gives Lanczos headroom
export const AVATAR_COMPRESSION_CONFIG: Options = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 800,
  useWebWorker: true,
  fileType: "image/jpeg",
};

export async function compressImage(
  file: File,
  config: Options = AVATAR_COMPRESSION_CONFIG,
): Promise<File> {
  return imageCompression(file, config);
}
