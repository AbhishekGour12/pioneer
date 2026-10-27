import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Athlete from './models/Athlete.js';
import Payment from './models/Payment.js';
import Coach from './models/Coach.js';
import Tournament from './models/Tournament.js';
import PhysioLog from './models/PhysioLog.js';
import Assessment from './models/Assessment.js';
import Inventory from './models/Inventory.js';
import MembershipPlan from './models/MembershipPlan.js';
import Inquiry from './models/Inquiry.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://agour4000_db_user:JBtFi3xShorDsMqY@cluster0.rvzhrqw.mongodb.net/playpeak?retryWrites=true&w=majority&appName=Cluster0';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🌱 Connected to MongoDB for seeding PlayPeak Academy data...');

        // 1. Seed Admin User if not present
        const adminEmail = 'admin@playpeak.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            await User.create({
                name: 'Head Coach & Admin',
                email: adminEmail,
                password: 'admin123',
                role: 'admin',
                phone: '+91 98261 00001',
                membership: {
                    status: 'active',
                    planName: 'Head Coach Admin Suite'
                }
            });
            console.log('✅ Admin user created: admin@playpeak.com / admin123');
        }

        // 2. Seed Athletes
        const athletesCount = await Athlete.countDocuments();
        if (athletesCount === 0) {
            await Athlete.insertMany([
                {
                    id: 'ATH-101',
                    name: 'Aarav Sharma',
                    phone: '+91 98261 55678',
                    email: 'aarav.sharma@gmail.com',
                    age: 16,
                    gender: 'Male',
                    sport: '10M Rifle Shooting',
                    batchTime: 'Evening Prime (04:00 PM - 07:00 PM)',
                    coach: 'Coach Rajesh Sharma (ISSF / NRAI)',
                    planType: 'Monthly',
                    membership: 'Monthly Training Membership',
                    feeAmount: 4700,
                    amountPaid: 4700,
                    dueAmount: 0,
                    paymentStatus: 'Paid',
                    emergencyContact: '+91 98261 55670',
                    bloodGroup: 'B+',
                    joinDate: '2026-01-10',
                    status: 'Active'
                },
                {
                    id: 'ATH-102',
                    name: 'Rohan Verma',
                    phone: '+91 91112 33445',
                    email: 'rohan.v@outlook.com',
                    age: 18,
                    gender: 'Male',
                    sport: '10M Pistol Shooting',
                    batchTime: 'Morning Pro (08:00 AM - 12:00 PM)',
                    coach: 'Coach Vikram Singh (National Medalist)',
                    planType: 'Registration',
                    membership: 'One-Time Annual Registration',
                    feeAmount: 5000,
                    amountPaid: 5000,
                    dueAmount: 0,
                    paymentStatus: 'Paid',
                    emergencyContact: '+91 91112 33440',
                    bloodGroup: 'O+',
                    joinDate: '2026-02-01',
                    status: 'Active'
                },
                {
                    id: 'ATH-103',
                    name: 'Pooja Iyer',
                    phone: '+91 94250 88991',
                    email: 'pooja.iyer@gmail.com',
                    age: 15,
                    gender: 'Female',
                    sport: 'Basketball',
                    batchTime: 'Evening Prime (05:00 PM - 07:00 PM)',
                    coach: 'Coach Rahul Nair (FIBA)',
                    planType: 'Monthly',
                    membership: 'Basketball Monthly Pass',
                    feeAmount: 3799,
                    amountPaid: 3799,
                    dueAmount: 0,
                    paymentStatus: 'Paid',
                    emergencyContact: '+91 94250 88990',
                    bloodGroup: 'A+',
                    joinDate: '2026-01-15',
                    status: 'Active'
                },
                {
                    id: 'ATH-104',
                    name: 'Kabir Singhania',
                    phone: '+91 98270 12345',
                    email: 'kabir.s@gmail.com',
                    age: 17,
                    gender: 'Male',
                    sport: 'Badminton',
                    batchTime: 'Morning Pro (06:30 AM - 08:30 AM)',
                    coach: 'Coach Ananya Sen (National)',
                    planType: 'Monthly',
                    membership: 'Badminton Monthly Pass',
                    feeAmount: 2499,
                    amountPaid: 0,
                    dueAmount: 2499,
                    paymentStatus: 'Due',
                    emergencyContact: '+91 98270 12340',
                    bloodGroup: 'AB+',
                    joinDate: '2026-02-15',
                    status: 'Active'
                },
                {
                    id: 'ATH-105',
                    name: 'Meera Deshmukh',
                    phone: '+91 97555 66778',
                    email: 'meera.d@gmail.com',
                    age: 14,
                    gender: 'Female',
                    sport: 'Swimming',
                    batchTime: 'Evening Elite (04:30 PM - 06:30 PM)',
                    coach: 'Coach Vikram Joshi',
                    planType: 'Yearly',
                    membership: 'Swimming Yearly Pass',
                    feeAmount: 32000,
                    amountPaid: 32000,
                    dueAmount: 0,
                    paymentStatus: 'Paid',
                    emergencyContact: '+91 97555 66770',
                    bloodGroup: 'O+',
                    joinDate: '2026-01-05',
                    status: 'Active'
                },
                {
                    id: 'ATH-106',
                    name: 'Arjun Rathore',
                    phone: '+91 99887 76655',
                    email: 'arjun.r@gmail.com',
                    age: 19,
                    gender: 'Male',
                    sport: 'Strength & Conditioning',
                    batchTime: 'Night Owls (08:00 PM - 10:00 PM)',
                    coach: 'Coach Elena Rostova',
                    planType: 'Monthly',
                    membership: 'Strength & Conditioning Monthly Pass',
                    feeAmount: 2499,
                    amountPaid: 0,
                    dueAmount: 2499,
                    paymentStatus: 'Due',
                    emergencyContact: '+91 99887 76650',
                    bloodGroup: 'B-',
                    joinDate: '2026-02-10',
                    status: 'Active'
                }
            ]);
            console.log('✅ Seeded Athletes in MongoDB');
        }

        // 3. Seed Payments
        const paymentsCount = await Payment.countDocuments();
        if (paymentsCount === 0) {
            await Payment.insertMany([
                {
                    id: 'PAY-101',
                    athleteId: 'ATH-101',
                    athleteName: 'Aarav Sharma',
                    sport: '10M Rifle Shooting',
                    plan: 'Monthly Training Membership',
                    amount: 4700,
                    date: '2026-02-10',
                    dueDate: '2026-03-10',
                    method: 'UPI (GPay)',
                    status: 'Completed',
                    receiptNo: 'RCP-2026-0101'
                },
                {
                    id: 'PAY-102',
                    athleteId: 'ATH-102',
                    athleteName: 'Rohan Verma',
                    sport: '10M Pistol Shooting',
                    plan: 'One-Time Annual Registration Fee',
                    amount: 5000,
                    date: '2026-02-01',
                    dueDate: '2026-03-01',
                    method: 'Credit Card',
                    status: 'Completed',
                    receiptNo: 'RCP-2026-0102'
                },
                {
                    id: 'PAY-103',
                    athleteId: 'ATH-103',
                    athleteName: 'Pooja Iyer',
                    sport: 'Basketball',
                    plan: 'Basketball Monthly Pass',
                    amount: 3799,
                    date: '2026-02-15',
                    dueDate: '2026-03-15',
                    method: 'PhonePe',
                    status: 'Completed',
                    receiptNo: 'RCP-2026-0103'
                },
                {
                    id: 'PAY-104',
                    athleteId: 'ATH-105',
                    athleteName: 'Meera Deshmukh',
                    sport: 'Swimming',
                    plan: 'Swimming Yearly Pass',
                    amount: 32000,
                    date: '2026-01-05',
                    dueDate: '2027-01-05',
                    method: 'Net Banking',
                    status: 'Completed',
                    receiptNo: 'RCP-2026-0104'
                }
            ]);
            console.log('✅ Seeded Payments in MongoDB');
        }

        // 4. Seed Coaches
        const coachesCount = await Coach.countDocuments();
        if (coachesCount === 0) {
            await Coach.insertMany([
                { id: 'COACH-1', name: 'Rajesh Sharma', sport: 'Football', role: 'Head Coach (AFC Pro License)', experience: '12+ Years', activeStudents: 32, rating: 4.9, status: 'Active' },
                { id: 'COACH-2', name: 'Vikram Singh', sport: 'Cricket', role: 'Chief Cricket Mentor (BCCI Level 3)', experience: '14+ Years', activeStudents: 28, rating: 4.9, status: 'Active' },
                { id: 'COACH-3', name: 'Rahul Nair', sport: 'Basketball', role: 'Head Basketball Coach (FIBA Certified)', experience: '9+ Years', activeStudents: 24, rating: 4.8, status: 'Active' },
                { id: 'COACH-4', name: 'Ananya Sen', sport: 'Badminton', role: 'National Badminton Mentor', experience: '8+ Years', activeStudents: 18, rating: 4.9, status: 'Active' },
                { id: 'COACH-5', name: 'Elena Rostova', sport: 'Strength & Conditioning', role: 'Olympic S&C Specialist', experience: '10+ Years', activeStudents: 45, rating: 5.0, status: 'Active' }
            ]);
            console.log('✅ Seeded Coaches in MongoDB');
        }

        // 5. Seed Tournaments
        const tournamentsCount = await Tournament.countDocuments();
        if (tournamentsCount === 0) {
            await Tournament.insertMany([
                { id: 'TRN-1', title: 'PlayPeak Premier Football League (U-19)', sport: 'Football', date: '2026-03-15', prizePool: '₹1,00,000', teamsRegistered: 12, maxTeams: 16, entryFee: '₹2,500', status: 'Open for Registration' },
                { id: 'TRN-2', title: 'Apex Slam 3x3 Basketball Showcase', sport: 'Basketball', date: '2026-03-22', prizePool: '₹50,000', teamsRegistered: 8, maxTeams: 12, entryFee: '₹1,500', status: 'Open for Registration' },
                { id: 'TRN-3', title: 'Inter-Academy Cricket T20 Clash', sport: 'Cricket', date: '2026-04-05', prizePool: '₹75,000', teamsRegistered: 6, maxTeams: 8, entryFee: '₹3,000', status: 'Upcoming' }
            ]);
            console.log('✅ Seeded Tournaments in MongoDB');
        }

        // 6. Seed Physio Logs
        const physioCount = await PhysioLog.countDocuments();
        if (physioCount === 0) {
            await PhysioLog.insertMany([
                { id: 'PHY-1', athleteName: 'Aarav Sharma', sport: 'Football', injury: 'Right Hamstring Grade 1 Strain', therapist: 'Dr. Neha Verma (Sports PT)', sessionDate: '2026-02-18', recoveryStatus: 'Rehab Phase', rehabPlan: 'Isometric load + Cryotherapy' },
                { id: 'PHY-2', athleteName: 'Rohan Verma', sport: 'Cricket', injury: 'Rotator Cuff Inflammation', therapist: 'Dr. Neha Verma (Sports PT)', sessionDate: '2026-02-20', recoveryStatus: 'Under Treatment', rehabPlan: 'Theraband resistance + Ultrasound' }
            ]);
            console.log('✅ Seeded Physio Logs in MongoDB');
        }

        // 7. Seed Assessments
        const assessmentsCount = await Assessment.countDocuments();
        if (assessmentsCount === 0) {
            await Assessment.insertMany([
                { id: 'FIT-1', athleteName: 'Aarav Sharma', sport: 'Football', evaluator: 'Coach Elena Rostova', date: '2026-02-12', sprint40m: '4.88s', verticalJump: '68 cm', vo2Max: '58 ml/kg', agilityIndex: '9.4 / 10', overallScore: 'Elite Athlete' },
                { id: 'FIT-2', athleteName: 'Kabir Singhania', sport: 'Badminton', evaluator: 'Coach Elena Rostova', date: '2026-02-14', sprint40m: '5.10s', verticalJump: '62 cm', vo2Max: '52 ml/kg', agilityIndex: '9.6 / 10', overallScore: 'High Pro' }
            ]);
            console.log('✅ Seeded Fitness Assessments in MongoDB');
        }

        // 8. Seed Inventory
        const inventoryCount = await Inventory.countDocuments();
        if (inventoryCount === 0) {
            await Inventory.insertMany([
                { id: 'GEAR-1', item: 'FIFA Pro Match Footballs (Size 5)', category: 'Match Balls', sport: 'Football', totalStock: 30, available: 22, inUse: 8, unitPrice: 2499, location: 'Turf Gear Vault #1', lastAudited: '2026-02-15' },
                { id: 'GEAR-2', item: 'English Willow Practice Bats', category: 'Batting Equipment', sport: 'Cricket', totalStock: 15, available: 10, inUse: 5, unitPrice: 7999, location: 'Cricket Pavilion Cage', lastAudited: '2026-02-10' },
                { id: 'GEAR-3', item: 'FIBA Official Composite Basketballs (Size 7)', category: 'Game Balls', sport: 'Basketball', totalStock: 25, available: 18, inUse: 7, unitPrice: 2199, location: 'Hardwood Court Locker', lastAudited: '2026-02-18' }
            ]);
            console.log('✅ Seeded Gear Inventory in MongoDB');
        }

        // 9. Seed Membership Plans
        const plansCount = await MembershipPlan.countDocuments();
        if (plansCount === 0) {
            await MembershipPlan.insertMany([
                { id: 'PLN-01', name: 'Monthly Training Membership', sport: '10M Rifle & Pistol Shooting', duration: '1 Month (Daily 1-1.5 Hrs)', price: 4700, period: '/month', badge: 'Official Monthly Fee', popular: true, features: ['Daily 1 - 1.5 Hour Sessions', 'Pellet Boxes Included', 'Target Papers Provided', 'Match Weapons & Equipment Access', 'Certified Coach Guidance'] },
                { id: 'PLN-02', name: 'One-Time Annual Registration', sport: 'Shooter Accreditation', duration: '1 Year', price: 5000, period: '/year', badge: 'Official Annual Fee', popular: false, features: ['Official Pioneer Shooter ID', 'Locker & Range Gate Access', 'District & State Trials Affiliation', 'Safety Audit & Weapon Fitting'] }
            ]);
            console.log('✅ Seeded Membership Plans in MongoDB');
        }

        // 10. Seed Inquiries
        const inquiriesCount = await Inquiry.countDocuments();
        if (inquiriesCount === 0) {
            await Inquiry.insertMany([
                { id: 'LEAD-101', name: 'Siddharth Malhotra', phone: '+91 98930 11223', email: 'sid.m@gmail.com', sport: 'Football', planInterested: 'Pro Academy Monthly', message: 'Looking for weekend batch coaching for my son (age 14).', date: '2026-02-22', status: 'New', trialDate: '2026-02-26' },
                { id: 'LEAD-102', name: 'Priya Joshi', phone: '+91 97520 44556', email: 'priya.j@gmail.com', sport: 'Badminton', planInterested: 'Starter Athlete Pass', message: 'Inquiring about morning 6:30 AM slot availability.', date: '2026-02-21', status: 'Trial Scheduled', trialDate: '2026-02-24' }
            ]);
            console.log('✅ Seeded Inquiries in MongoDB');
        }

        console.log('🎉 PLAYPEAK MONGODB ATLAS SEEDING COMPLETED SUCCESSFULLY!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
};

seedData();
