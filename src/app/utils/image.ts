export async function compressImage(base64Image: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      console.log(canvas)
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    }
    img.onerror = (error) => {
      console.error('Image loading error:', error);
      reject('');
    };
  })
}

export function getImageSize(base64String: string): number {
  return calculateBase64ByteSize(base64String.split(',')[1]);
}

function calculateBase64ByteSize(base64String: string): number {
  const padding = (base64String.endsWith('==')) ? 2 : (base64String.endsWith('=')) ? 1 : 0;
  return (base64String.length * 3) / 4 - padding;
}
