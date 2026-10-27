import express from 'express';
import mongoose from 'mongoose';
import Athlete from '../models/Athlete.js';

const router = express.Router();

const getQueryFilter = (id) => {
    if (!id || id === 'undefined' || id === 'null') return { _id: new mongoose.Types.ObjectId() };
    const isObjectId = mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
    return isObjectId ? { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { id: String(id) }] } : { id: String(id) };
};

// GET all athletes with optional sport and status filtering
router.get('/', async (req, res) => {
    try {
        const { sport, status, search } = req.query;
        let query = {};

        if (sport && sport !== 'All') query.sport = sport;
        if (status && status !== 'All') query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { sport: { $regex: search, $options: 'i' } },
                { id: { $regex: search, $options: 'i' } }
            ];
        }

        const athletes = await Athlete.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: athletes.length, data: athletes });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single athlete by ID
router.get('/:id', async (req, res) => {
    try {
        const athlete = await Athlete.findOne(getQueryFilter(req.params.id));
        if (!athlete) return res.status(404).json({ success: false, message: 'Athlete not found' });
        res.json({ success: true, data: athlete });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// CREATE new athlete
router.post('/', async (req, res) => {
    try {
        let athleteId = req.body.id;
        if (!athleteId || await Athlete.findOne({ id: athleteId })) {
            athleteId = `ATH-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
        }
        const athlete = new Athlete({ ...req.body, id: athleteId });
        const saved = await athlete.save();
        console.log(`🎯 New athlete enrolled successfully in MongoDB: ${saved.name} (${saved.id})`);
        if (req.io) req.io.emit('athlete_created', saved);
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        console.error('❌ Failed to create athlete in MongoDB:', err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// BATCH DELETE MULTIPLE ATHLETES
router.post('/batch-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'No athlete IDs provided' });
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

        const result = await Athlete.deleteMany(filter);
        if (req.io) req.io.emit('athletes_batch_deleted', { ids });
        res.json({ success: true, message: `${result.deletedCount} athletes removed successfully`, count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE ALL / CLEAR ALL ATHLETES
router.delete('/', async (req, res) => {
    try {
        const result = await Athlete.deleteMany({});
        if (req.io) req.io.emit('athletes_cleared');
        res.json({ success: true, message: 'All athlete records cleared successfully', count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/clear-all', async (req, res) => {
    try {
        const result = await Athlete.deleteMany({});
        if (req.io) req.io.emit('athletes_cleared');
        res.json({ success: true, message: 'All athlete records cleared successfully', count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// UPDATE athlete by ID
router.put('/:id', async (req, res) => {
    try {
        const updated = await Athlete.findOneAndUpdate(
            getQueryFilter(req.params.id),
            { $set: req.body },
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: 'Athlete not found' });
        if (req.io) req.io.emit('athlete_updated', updated);
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE athlete by ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Athlete.findOneAndDelete(getQueryFilter(req.params.id));
        if (!deleted) return res.status(404).json({ success: false, message: 'Athlete not found' });
        if (req.io) req.io.emit('athlete_deleted', deleted);
        res.json({ success: true, message: 'Athlete removed from academy records', data: deleted });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// BULK SYNC (Saves array of athletes)
router.post('/bulk-sync', async (req, res) => {
    try {
        const { athletes } = req.body;
        if (!Array.isArray(athletes)) return res.status(400).json({ success: false, message: 'Invalid data' });
        
        for (const ath of athletes) {
            await Athlete.findOneAndUpdate(
                { id: ath.id },
                { $set: ath },
                { upsert: true, new: true }
            );
        }
        const all = await Athlete.find({}).sort({ createdAt: -1 });
        res.json({ success: true, message: 'Athletes synced with MongoDB', data: all });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
