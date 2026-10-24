/**
 * Safe Image Compressor utility
 * Resizes large user images (camera photos, phone gallery uploads) down to web-friendly
 * dimensions and compresses to JPEG to prevent QuotaExceededError and avoid memory crashes.
 */

export async function compressImageFile(file: File, maxWidth = 960, maxHeight = 720, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate aspect ratio scaling
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // If raw image is under 800KB, fallback to reader result safely
            if (file.size < 800 * 1024) {
              resolve(reader.result as string);
            } else {
              reject(new Error('Image is too large to process without canvas context'));
            }
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'medium';
          ctx.drawImage(img, 0, 0, width, height);

          // Export as compressed JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          if (file.size < 800 * 1024) {
            resolve(reader.result as string);
          } else {
            reject(new Error('Image compression encountered memory limitations'));
          }
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

