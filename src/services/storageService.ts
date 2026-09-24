import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

export interface UploadResult {
  url: string;
  path?: string;
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image (JPEG, PNG, WebP, or SVG)' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }
  return { valid: true };
}

/**
 * Uploads a file to Firebase Storage with progress tracking.
 * Falls back to base64 if Firebase Storage fails (e.g. storage rules / bucket CORS sandbox).
 */
export async function uploadImage(
  file: File,
  folder: 'logos' | 'services' | 'projects' | 'blog' | 'testimonials' | 'quote-uploads',
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file');
  }

  const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = `${folder}/${cleanFileName}`;

  try {
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return await new Promise<UploadResult>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          console.warn('Firebase Storage upload failed, utilizing resilient fallback:', error);
          // Fallback to base64 data URL
          readFileAsDataURL(file)
            .then((url) => {
              if (onProgress) onProgress(100);
              resolve({ url, path: filePath });
            })
            .catch(reject);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve({ url: downloadUrl, path: filePath });
          } catch (err) {
            console.warn('Get download URL failed, falling back to data URL:', err);
            const dataUrl = await readFileAsDataURL(file);
            resolve({ url: dataUrl, path: filePath });
          }
        }
      );
    });
  } catch (err) {
    console.warn('Initial storage ref failed, using dataURL fallback:', err);
    const dataUrl = await readFileAsDataURL(file);
    if (onProgress) onProgress(100);
    return { url: dataUrl, path: filePath };
  }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function deleteUploadedImage(pathOrUrl: string): Promise<void> {
  if (!pathOrUrl || pathOrUrl.startsWith('data:')) return;
  try {
    const storageRef = ref(storage, pathOrUrl);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn('Could not delete storage image:', err);
  }
}
