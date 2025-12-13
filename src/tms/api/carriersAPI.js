// Supabase adapter for Carriers module
import { supabase } from '../../lib/supabase';

export const carriersAPI = {
    // Fetch all carriers with optional filters
    async fetchCarriers(filters = {}) {
        try {
            let query = supabase
                .from('tms_carriers')
                .select('*')
                .order('created_at', { ascending: false });

            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,mc_number.ilike.%${filters.search}%,dot_number.ilike.%${filters.search}%`);
            }

            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            const { data, error } = await query;
            if (error) throw error;

            const transformed = data.map(carrier => ({
                id: carrier.id,
                name: carrier.name,
                mcNumber: carrier.mc_number,
                dotNumber: carrier.dot_number,
                contactName: carrier.contact_name,
                email: carrier.email,
                phone: carrier.phone,
                insuranceExpiry: carrier.insurance_expiry,
                creditStatus: carrier.credit_status,
                status: carrier.status,
                createdAt: carrier.created_at,
                updatedAt: carrier.updated_at
            }));

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error fetching carriers:', error);
            return { success: false, error: error.message };
        }
    },

    // Create new carrier
    async createCarrier(carrierData) {
        try {
            const insertData = {
                name: carrierData.name,
                mc_number: carrierData.mcNumber || null,
                dot_number: carrierData.dotNumber || null,
                contact_name: carrierData.contactName || null,
                email: carrierData.email || null,
                phone: carrierData.phone || null,
                insurance_expiry: carrierData.insuranceExpiry || null,
                credit_status: carrierData.creditStatus || 'Approved',
                status: carrierData.status || 'Active'
            };

            const { data, error } = await supabase
                .from('tms_carriers')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;

            const transformed = {
                id: data.id,
                name: data.name,
                mcNumber: data.mc_number,
                dotNumber: data.dot_number,
                contactName: data.contact_name,
                email: data.email,
                phone: data.phone,
                insuranceExpiry: data.insurance_expiry,
                creditStatus: data.credit_status,
                status: data.status,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            };

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error creating carrier:', error);
            return { success: false, error: error.message };
        }
    },

    // Update carrier
    async updateCarrier(id, updates) {
        try {
            const updateData = {
                name: updates.name,
                mc_number: updates.mcNumber || null,
                dot_number: updates.dotNumber || null,
                contact_name: updates.contactName || null,
                email: updates.email || null,
                phone: updates.phone || null,
                insurance_expiry: updates.insuranceExpiry || null,
                credit_status: updates.creditStatus,
                status: updates.status,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('tms_carriers')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            const transformed = {
                id: data.id,
                name: data.name,
                mcNumber: data.mc_number,
                dotNumber: data.dot_number,
                contactName: data.contact_name,
                email: data.email,
                phone: data.phone,
                insuranceExpiry: data.insurance_expiry,
                creditStatus: data.credit_status,
                status: data.status,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            };

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error updating carrier:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete carrier
    async deleteCarrier(id) {
        try {
            const { error } = await supabase
                .from('tms_carriers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting carrier:', error);
            return { success: false, error: error.message };
        }
    },

    // Get carrier with related loads
    async getCarrierWithLoads(carrierId) {
        try {
            const { data: carrier, error: carrierError } = await supabase
                .from('tms_carriers')
                .select('*')
                .eq('id', carrierId)
                .single();

            if (carrierError) throw carrierError;

            const { data: loads, error: loadsError } = await supabase
                .from('loads')
                .select('*')
                .eq('carrier_id', carrierId)
                .order('created_at', { ascending: false });

            if (loadsError) throw loadsError;

            return {
                success: true,
                data: {
                    carrier: {
                        id: carrier.id,
                        name: carrier.name,
                        mcNumber: carrier.mc_number,
                        dotNumber: carrier.dot_number,
                        status: carrier.status,
                        insuranceExpiry: carrier.insurance_expiry
                    },
                    loads: loads.map(load => ({
                        id: load.id,
                        pickupAddress: load.pickup_address,
                        deliveryAddress: load.delivery_address,
                        carrierCost: load.carrier_cost,
                        status: load.status,
                        createdAt: load.created_at
                    }))
                }
            };
        } catch (error) {
            console.error('Error fetching carrier with loads:', error);
            return { success: false, error: error.message };
        }
    }
};
