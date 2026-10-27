import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    athleteId: { type: String },
    athleteName: { type: String, required: true },
    sport: { type: String, default: '10M Rifle Shooting' },
    plan: { type: String, default: 'Monthly Training Membership' },
    amount: { type: Number, required: true, default: 4700 },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    dueDate: { type: String },
    method: { type: String, default: 'UPI (GPay)' },
    status: { type: String, enum: ['Completed', 'Pending', 'Failed', 'Refunded'], default: 'Completed' },
    receiptNo: { type: String, unique: true },
    paymentMode: { type: String, enum: ['Cash', 'Online'], default: 'Cash' },
    utrNumber: { type: String, default: '' },
    transactionRef: { type: String },
    note: { type: String }
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);
