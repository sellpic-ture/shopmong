export type Fit = "crop" | "contain";

export function drawThumbnail(canvas: HTMLCanvasElement, image: HTMLImageElement, size: number, fit: Fit, position: number) {
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("이 브라우저에서 이미지 처리를 사용할 수 없습니다.");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);
  const scale = fit === "crop"
    ? Math.max(size / image.naturalWidth, size / image.naturalHeight)
    : Math.min(size / image.naturalWidth, size / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  ctx.drawImage(image, (size - width) * position, (size - height) * position, width, height);
}

export async function encodeImage(canvas: HTMLCanvasElement, format: "jpg" | "png" | "webp", maxBytes: number, quality: number) {
  const mime = format === "jpg" ? "image/jpeg" : `image/${format}`;
  let currentQuality = quality;
  while (true) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, currentQuality));
    if (!blob || blob.type !== mime) throw new Error("선택한 출력 형식을 지원하지 않는 브라우저입니다.");
    if (blob.size <= maxBytes) return blob;
    if (format === "png" || currentQuality <= 0.35) throw new Error("결과 파일이 용량 제한을 초과합니다. JPG를 선택하거나 품질을 낮춰주세요.");
    currentQuality = Math.max(0.35, currentQuality - 0.1);
  }
}
