import express from 'express';
import mongoose from 'mongoose';
import Payment from '../models/Payment.js';

const router = express.Router();

const getQueryFilter = (id) => {
    if (!id || id === 'undefined' || id === 'null') return { _id: new mongoose.Types.ObjectId() };
    const isObjectId = mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
    return isObjectId ? { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { id: String(id) }] } : { id: String(id) };
};

// GET all payments
router.get('/', async (req, res) => {
    try {
        const { status, athleteId } = req.query;
        let query = {};
        if (status && status !== 'All') query.status = status;
        if (athleteId) query.athleteId = athleteId;

        const payments = await Payment.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: payments.length, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// CREATE payment
router.post('/', async (req, res) => {
    try {
        let paymentId = req.body.id;
        if (!paymentId || await Payment.findOne({ id: paymentId })) {
            paymentId = `PAY-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;
        }
        let receiptNo = req.body.receiptNo;
        if (!receiptNo || await Payment.findOne({ receiptNo })) {
            receiptNo = `RCP-2026-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        const payment = new Payment({ ...req.body, id: paymentId, receiptNo });
        const saved = await payment.save();
        if (req.io) req.io.emit('payment_recorded', saved);
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        console.error('❌ Failed to record payment in MongoDB:', err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// BATCH DELETE MULTIPLE PAYMENTS
router.post('/batch-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'No payment IDs provided' });
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

        const result = await Payment.deleteMany(filter);
        if (req.io) req.io.emit('payments_batch_deleted', { ids });
        res.json({ success: true, message: `${result.deletedCount} payments removed successfully`, count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE ALL / CLEAR ALL PAYMENTS
router.delete('/', async (req, res) => {
    try {
        const result = await Payment.deleteMany({});
        if (req.io) req.io.emit('payments_cleared');
        res.json({ success: true, message: 'All payment records cleared successfully', count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/clear-all', async (req, res) => {
    try {
        const result = await Payment.deleteMany({});
        if (req.io) req.io.emit('payments_cleared');
        res.json({ success: true, message: 'All payment records cleared successfully', count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// UPDATE payment
router.put('/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.__v;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        const updated = await Payment.findOneAndUpdate(
            getQueryFilter(req.params.id),
            { $set: updateData },
            { new: true, runValidators: false }
        );
        if (!updated) return res.status(404).json({ success: false, message: 'Payment not found' });
        if (req.io) req.io.emit('payment_updated', updated);
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Payment.findOneAndDelete(getQueryFilter(req.params.id));
        if (!deleted) return res.status(404).json({ success: false, message: 'Payment not found' });
        if (req.io) req.io.emit('payment_deleted', deleted);
        res.json({ success: true, message: 'Payment record deleted', data: deleted });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// BULK SYNC
router.post('/bulk-sync', async (req, res) => {
    try {
        const { payments } = req.body;
        if (!Array.isArray(payments)) return res.status(400).json({ success: false, message: 'Invalid data' });
        
        for (const pay of payments) {
            await Payment.findOneAndUpdate(
                { id: pay.id },
                { $set: pay },
                { upsert: true, new: true }
            );
        }
        const all = await Payment.find({}).sort({ createdAt: -1 });
        res.json({ success: true, message: 'Payments synced with MongoDB', data: all });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
