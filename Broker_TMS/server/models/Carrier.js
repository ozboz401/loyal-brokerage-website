import mongoose from 'mongoose';

const carrierSchema = new mongoose.Schema({
    carrier_name: { type: String, required: true },
    mc_number: { type: String, required: true, unique: true },
    dot_number: { type: String, required: true },
    ein: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },

    // Insurance
    insurance_liability: { type: Number, required: true },
    insurance_cargo: { type: Number, required: true },
    insurance_expiration: { type: Date, required: true },

    // Files (URLs)
    w9_file_url: { type: String },
    coi_file_url: { type: String },
    signed_agreement_url: { type: String },

    // Status
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },

    created_at: { type: Date, default: Date.now }
});

const Carrier = mongoose.model('Carrier', carrierSchema);

export default Carrier;
