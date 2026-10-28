// routes/UploadRoutes.js - Image Upload & Cloudflare R2 Management Router
import express from 'express';
import multer from 'multer';
import { uploadFileToStorage, deleteFileFromStorage, isR2Configured } from '../utils/r2Upload.js';

const router = express.Router();

// Configure Multer with memory storage (10MB limit for student photos)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, WEBP, GIF) are allowed'), false);
        }
    }
});

// Check R2 Configuration Status
router.get('/status', (req, res) => {
    const configured = isR2Configured();
    res.json({
        success: true,
        r2Configured: configured,
        mode: configured ? 'Cloudflare R2 Storage' : 'Local Disk Fallback',
        bucket: configured ? process.env.R2_BUCKET_NAME : null,
        publicUrl: configured ? (process.env.R2_PUBLIC_URL || 'Direct R2 Endpoint') : null
    });
});

// Upload Single Student Photo (Accepts multipart/form-data with field 'photo', 'image', or 'file')
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        let buffer;
        let originalname = 'student_photo.jpg';
        let mimetype = 'image/jpeg';

        if (req.file) {
            buffer = req.file.buffer;
            originalname = req.file.originalname;
            mimetype = req.file.mimetype;
        } else if (req.body.base64) {
            // Support base64 image strings as alternative
            const matches = req.body.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                return res.status(400).json({ success: false, message: 'Invalid base64 image format' });
            }
            mimetype = matches[1];
            buffer = Buffer.from(matches[2], 'base64');
            originalname = req.body.fileName || `student_${Date.now()}.jpg`;
        } else {
            return res.status(400).json({ success: false, message: 'No image file or base64 data provided' });
        }

        const folder = req.body.folder || 'students';
        const result = await uploadFileToStorage(buffer, originalname, mimetype, folder);

        res.json({
            success: true,
            url: result.url,
            key: result.key,
            storage: result.storage,
            message: result.storage === 'r2' 
                ? 'Image uploaded successfully to Cloudflare R2' 
                : 'Image uploaded to local storage (R2 keys not set in .env)'
        });
    } catch (err) {
        console.error('❌ Upload error:', err);
        res.status(500).json({ success: false, message: err.message || 'Image upload failed' });
    }
});

// Delete Image from Storage
router.post('/delete', async (req, res) => {
    try {
        const { key, url } = req.body;
        const target = key || url;
        if (!target) {
            return res.status(400).json({ success: false, message: 'Target key or url is required' });
        }

        const deleted = await deleteFileFromStorage(target);
        res.json({
            success: true,
            deleted,
            message: deleted ? 'Image deleted successfully' : 'File could not be found or was already removed'
        });
    } catch (err) {
        console.error('❌ Delete image error:', err);
        res.status(500).json({ success: false, message: err.message || 'Failed to delete image' });
    }
});

export default router;
