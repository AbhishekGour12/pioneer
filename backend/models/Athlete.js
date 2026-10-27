import mongoose from 'mongoose';

const AthleteSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    age: { type: Number, default: 16 },
    gender: { type: String, default: 'Male' },
    sport: { type: String, required: true, default: '10M Rifle Shooting' },
    batchTime: { type: String, default: 'Evening Prime Shift (04:00 PM - 07:00 PM)' },
    coach: { type: String, default: 'Coach Rajesh Sharma (ISSF / NRAI)' },
    planType: { type: String, default: 'Monthly' },
    membership: { type: String, default: 'Monthly Training Membership' },
    feeAmount: { type: Number, default: 4700 },
    amountPaid: { type: Number, default: 4700 },
    dueAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, default: 'Paid' },
    emergencyContact: { type: String, default: '' },
    bloodGroup: { type: String, default: 'B+' },
    joinDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    status: { type: String, default: 'Active' },
    paymentMode: { type: String, default: 'Cash' },
    utrNumber: { type: String, default: '' },
    notes: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Athlete', AthleteSchema);
