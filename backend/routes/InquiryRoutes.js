import express from 'express';
import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';

const router = express.Router();

const getQueryFilter = (id) => {
    if (!id || id === 'undefined' || id === 'null') return { _id: new mongoose.Types.ObjectId() };
    const isObjectId = mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
    return isObjectId ? { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { id: String(id) }] } : { id: String(id) };
};

router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
        res.json({ success: true, count: inquiries.length, data: inquiries });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = req.body.id || `LEAD-${Math.floor(100 + Math.random() * 900)}`;
        const inquiry = new Inquiry({ ...req.body, id });
        const saved = await inquiry.save();
        if (req.io) req.io.emit('new_inquiry_received', saved);
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// BATCH DELETE MULTIPLE INQUIRIES
router.post('/batch-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'No inquiry IDs provided' });
        }
        const objectIds = ids
            .filter(id => id && mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id))
            .map(id => new mongoose.Types.ObjectId(id));
        const stringIds = ids.filter(Boolean).map(String);

        const filter = {
            $or: [
                { id: { $in: stringIds } },
                ...(objectIds.length > 0 ? [{ _id: { $in: objectIds } }] : [])
            ]
        };

        const result = await Inquiry.deleteMany(filter);
        if (req.io) req.io.emit('inquiries_batch_deleted', { ids });
        res.json({ success: true, message: `${result.deletedCount} inquiries deleted successfully`, count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE ALL / CLEAR ALL INQUIRIES
router.delete('/', async (req, res) => {
    try {
        const result = await Inquiry.deleteMany({});
        if (req.io) req.io.emit('inquiries_cleared');
        res.json({ success: true, message: 'All contact queries cleared successfully', count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/clear-all', async (req, res) => {
    try {
        const result = await Inquiry.deleteMany({});
        if (req.io) req.io.emit('inquiries_cleared');
        res.json({ success: true, message: 'All contact queries cleared successfully', count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await Inquiry.findOneAndUpdate(
            getQueryFilter(req.params.id),
            { $set: req.body },
            { new: true }
        );
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Inquiry.findOneAndDelete(getQueryFilter(req.params.id));
        if (req.io && deleted) {
            req.io.emit('inquiry_deleted', deleted);
        }
        res.json({ success: true, message: 'Inquiry removed successfully', data: deleted });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/bulk-sync', async (req, res) => {
    try {
        const { inquiries } = req.body;
        if (!Array.isArray(inquiries)) return res.status(400).json({ success: false, message: 'Invalid data' });
        for (const i of inquiries) {
            await Inquiry.findOneAndUpdate({ id: i.id }, { $set: i }, { upsert: true, new: true });
        }
        const all = await Inquiry.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: all });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
