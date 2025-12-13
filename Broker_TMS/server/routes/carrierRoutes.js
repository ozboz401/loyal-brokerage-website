import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Carrier from '../models/Carrier.js';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'server/uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// POST /carrier/onboard - Submit onboarding form
router.post('/onboard', upload.fields([
    { name: 'w9_file', maxCount: 1 },
    { name: 'coi_file', maxCount: 1 },
    { name: 'agreement_file', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            carrier_name, mc_number, dot_number, ein, phone, email, address,
            insurance_liability, insurance_cargo, insurance_expiration
        } = req.body;

        // Basic Validation (Backend side)
        if (Number(insurance_liability) < 1000000) {
            return res.status(400).json({ message: 'Auto Liability must be at least $1,000,000' });
        }
        if (Number(insurance_cargo) < 100000) {
            return res.status(400).json({ message: 'Cargo Coverage must be at least $100,000' });
        }

        const files = req.files;
        const w9_file_url = files['w9_file'] ? `/uploads/${files['w9_file'][0].filename}` : null;
        const coi_file_url = files['coi_file'] ? `/uploads/${files['coi_file'][0].filename}` : null;
        const signed_agreement_url = files['agreement_file'] ? `/uploads/${files['agreement_file'][0].filename}` : null;

        const newCarrier = new Carrier({
            carrier_name,
            mc_number,
            dot_number,
            ein,
            phone,
            email,
            address,
            insurance_liability,
            insurance_cargo,
            insurance_expiration,
            w9_file_url,
            coi_file_url,
            signed_agreement_url,
            status: 'Pending'
        });

        await newCarrier.save();

        // TODO: Send confirmation email here

        res.status(201).json({ message: 'Carrier onboarding submitted successfully', carrier: newCarrier });
    } catch (error) {
        console.error('Onboarding Error:', error);
        res.status(500).json({ message: 'Server error during onboarding', error: error.message });
    }
});

// GET /carrier/admin/all - List all carriers (Admin)
router.get('/admin/all', async (req, res) => {
    try {
        const carriers = await Carrier.find().sort({ created_at: -1 });
        res.json(carriers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching carriers', error: error.message });
    }
});

// GET /carrier/:mc - Get carrier details
router.get('/:mc', async (req, res) => {
    try {
        const carrier = await Carrier.findOne({ mc_number: req.params.mc });
        if (!carrier) return res.status(404).json({ message: 'Carrier not found' });
        res.json(carrier);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching carrier', error: error.message });
    }
});

// POST /carrier/approve - Approve carrier
router.post('/approve', async (req, res) => {
    try {
        const { id } = req.body;
        const carrier = await Carrier.findByIdAndUpdate(id, { status: 'Approved' }, { new: true });

        // TODO: Send approval email

        res.json({ message: 'Carrier approved', carrier });
    } catch (error) {
        res.status(500).json({ message: 'Error approving carrier', error: error.message });
    }
});

// POST /carrier/reject - Reject carrier
router.post('/reject', async (req, res) => {
    try {
        const { id } = req.body;
        const carrier = await Carrier.findByIdAndUpdate(id, { status: 'Rejected' }, { new: true });
        res.json({ message: 'Carrier rejected', carrier });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting carrier', error: error.message });
    }
});

export default router;
