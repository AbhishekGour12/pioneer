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
    monthlyFee: { type: Number, default: 4700 },
    registrationFee: { type: Number, default: 5000 },
    nextDueDate: { 
        type: String, 
        default: () => {
            const d = new Date();
            d.setMonth(d.getMonth() + 1);
            return d.toISOString().split('T')[0];
        } 
    },
    lastPaymentDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    paidMonthsCount: { type: Number, default: 1 },
    emergencyContact: { type: String, default: '' },
    bloodGroup: { type: String, default: 'B+' },
    joinDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    status: { type: String, default: 'Active' },
    paymentMode: { type: String, default: 'Cash' },
    utrNumber: { type: String, default: '' },
    notes: { type: String, default: '' }
}, { timestamps: true, strict: false });

export default mongoose.model('Athlete', AthleteSchema);
