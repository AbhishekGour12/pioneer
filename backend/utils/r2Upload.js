// utils/r2Upload.js - Cloudflare R2 S3-Compatible Storage Utility with Local Fallback
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure local uploads directory exists as fallback
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

export const isR2Configured = () => {
    return Boolean(
        process.env.R2_ACCOUNT_ID &&
        process.env.R2_ACCESS_KEY_ID &&
        process.env.R2_SECRET_ACCESS_KEY &&
        process.env.R2_BUCKET_NAME
    );
};

export const getS3Client = () => {
    if (!isR2Configured()) return null;
    return new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID.trim()}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID.trim(),
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY.trim()
        }
    });
};

/**
 * Upload a file buffer to Cloudflare R2 (or fallback to local uploads)
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File MIME type
 * @param {string} folder - Destination subfolder in R2
 * @returns {Promise<{ url: string, key: string, storage: 'r2' | 'local' }>}
 */
export const uploadFileToStorage = async (buffer, originalName, mimeType, folder = 'students') => {
    const ext = path.extname(originalName) || '.jpg';
    const cleanBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueKey = `${folder}/${Date.now()}_${cleanBase.slice(0, 30)}${ext}`;

    if (isR2Configured()) {
        const s3 = getS3Client();
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME.trim(),
            Key: uniqueKey,
            Body: buffer,
            ContentType: mimeType || 'image/jpeg'
        });

        await s3.send(command);

        // Determine public URL
        let publicUrl = '';
        if (process.env.R2_PUBLIC_URL && process.env.R2_PUBLIC_URL.trim()) {
            const domain = process.env.R2_PUBLIC_URL.trim().replace(/\/$/, '');
            publicUrl = `${domain}/${uniqueKey}`;
        } else {
            publicUrl = `https://${process.env.R2_BUCKET_NAME.trim()}.${process.env.R2_ACCOUNT_ID.trim()}.r2.cloudflarestorage.com/${uniqueKey}`;
        }

        console.log(`☁️ Cloudflare R2: Uploaded ${uniqueKey} successfully to ${publicUrl}`);
        return {
            url: publicUrl,
            key: uniqueKey,
            storage: 'r2'
        };
    } else {
        // Fallback: Save to local uploads folder
        const localFilename = `${Date.now()}_${cleanBase.slice(0, 30)}${ext}`;
        const localPath = path.join(uploadsDir, localFilename);
        fs.writeFileSync(localPath, buffer);

        const localUrl = `/uploads/${localFilename}`;
        console.warn(`⚠️ R2 credentials not configured in .env. Saved file locally to ${localUrl}`);
        return {
            url: localUrl,
            key: localFilename,
            storage: 'local'
        };
    }
};

/**
 * Delete a file from Cloudflare R2 (or local fallback)
 * @param {string} keyOrUrl - Object key or file URL
 * @returns {Promise<boolean>}
 */
export const deleteFileFromStorage = async (keyOrUrl) => {
    if (!keyOrUrl) return false;

    try {
        if (isR2Configured()) {
            let key = keyOrUrl;
            if (keyOrUrl.startsWith('http')) {
                const parsed = new URL(keyOrUrl);
                key = parsed.pathname.replace(/^\//, '');
            }

            const s3 = getS3Client();
            const command = new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME.trim(),
                Key: key
            });

            await s3.send(command);
            console.log(`🗑️ Cloudflare R2: Deleted ${key}`);
            return true;
        } else {
            // Check if local file
            const filename = path.basename(keyOrUrl);
            const localPath = path.join(uploadsDir, filename);
            if (fs.existsSync(localPath)) {
                fs.unlinkSync(localPath);
                console.log(`🗑️ Local fallback: Deleted ${filename}`);
                return true;
            }
            return false;
        }
    } catch (err) {
        console.error('Failed to delete file from storage:', err);
        return false;
    }
};
