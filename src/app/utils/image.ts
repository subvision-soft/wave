import {encode} from '@jsquash/webp';

export async function compressImage(canvasElement: HTMLCanvasElement): Promise<string | null> {
  const ctx = canvasElement.getContext('2d');
  if (ctx === null) {
    return new Promise<null>((resolve, reject) => {
      resolve(null)
    })
  }

  return await encode(ctx.getImageData(0, 0, canvasElement.width, canvasElement.height))
    .then((buffer) => {
      const uint8Array = new Uint8Array(buffer);

      let binaryString = '';
      for (const byte of uint8Array) {
        binaryString += String.fromCharCode(byte);
      }

      return btoa(binaryString);
    })
}

function calculateBase64ByteSize(base64String: string): number {
  const padding = (base64String.endsWith('==')) ? 2 : (base64String.endsWith('=')) ? 1 : 0;
  return (base64String.length * 3) / 4 - padding;
}
