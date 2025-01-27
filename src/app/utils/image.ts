import imageCompression from 'browser-image-compression';

export async function compressImage(canvasElement: HTMLCanvasElement, type: string): Promise<string> {
  const options = {
    maxSizeMB: 1,
    alwaysKeepResolution: true,
    preserveExif: true,
    useWebWorker: true,
    fileType: type,
  }

  const file = await imageCompression(await imageCompression.canvasToFile(canvasElement, type, '', Date.now()), options)

  return await imageCompression.getDataUrlFromFile(file)
}

function calculateBase64ByteSize(base64String: string): number {
  const padding = (base64String.endsWith('==')) ? 2 : (base64String.endsWith('=')) ? 1 : 0;
  return (base64String.length * 3) / 4 - padding;
}
