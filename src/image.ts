/** Procesamiento local de imagen. No se envían fotos a servidores. */
export async function prepareImage(file: File, maxSide = 1200): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("El archivo debe ser una imagen.");
  if (file.size > 15 * 1024 * 1024) throw new Error("La imagen debe pesar menos de 15 MB.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen en este dispositivo.");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) => canvas.toBlob(
    blob => blob ? resolve(blob) : reject(new Error("No se pudo preparar la imagen.")),
    "image/webp", 0.88
  ));
}