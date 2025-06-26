import Compressor from "compressorjs";
import { fileToBase64 } from "./fileToBase64";

export async function compressImageFile(file: File): Promise<string> {
  const compressedData = await compressImage(file);
  const base64 = await fileToBase64(compressedData);
  return base64;
}

export async function compressImageBase64(
  imageBase64: string,
): Promise<string> {
  const res = await fetch(imageBase64);
  const blob = await res.blob();
  const compressedData = await compressImage(blob);
  const base64 = await fileToBase64(compressedData);
  return base64;
}

function compressImage(data: File | Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    return new Compressor(data, {
      maxWidth: 1920,
      maxHeight: 1920,
      convertTypes: "image/png,image/webp,image/jpeg,image/jpg",
      convertSize: 1.5 * 1024 * 1024, // 1.5MB
      success(result: Blob) {
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
}
