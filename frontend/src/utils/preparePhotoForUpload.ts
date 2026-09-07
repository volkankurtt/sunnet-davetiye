const MAX_EDGE = 1920
const QUALITY = 0.83
const SKIP_BELOW_BYTES = 350_000

function isHeicLike(file: File) {
  const name = file.name.toLowerCase()
  return (
    name.endsWith('.heic') ||
    name.endsWith('.heif') ||
    file.type === 'image/heic' ||
    file.type === 'image/heif'
  )
}

function toJpegName(name: string) {
  return name.replace(/\.[^.]+$/, '') + '.jpg'
}

export async function preparePhotoForUpload(file: File): Promise<File> {
  if (isHeicLike(file) || file.size < SKIP_BELOW_BYTES) return file
  if (typeof createImageBitmap !== 'function') return file

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return file
    }
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', QUALITY)
    })
    if (!blob || blob.size >= file.size) return file

    return new File([blob], toJpegName(file.name), {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })
  } catch {
    return file
  }
}
