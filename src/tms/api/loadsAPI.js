// Supabase adapter for loads module
import { supabase } from '../../lib/supabase';

export const loadsAPI = {
    // Fetch all loads (with optional filters)
    async fetchLoads(filters = {}) {
        try {
            let query = supabase.from('loads').select('*').order('created_at', { ascending: false });

            // Apply filters
            if (filters.agentId) {
                query = query.eq('agent_id', filters.agentId);
            }
            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.customerId) {
                query = query.eq('customer_id', filters.customerId);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Transform to match frontend expectations
            const transformedData = data.map(load => ({
                id: load.id,
                customerId: load.customer_id,
                customerName: load.customer_name,
                carrierId: load.carrier_id,
                carrierName: load.carrier_name,
                agentId: load.agent_id,
                agentName: load.agent_name,
                pickupAddress: load.pickup_address,
                deliveryAddress: load.delivery_address,
                rate: parseFloat(load.rate),
                carrierCost: parseFloat(load.carrier_cost),
                tripDistance: load.trip_distance,
                status: load.status,
                equipmentType: load.equipment_type,
                appointmentDate: load.appointment_date,
                referenceNumber: load.reference_number,
                notes: load.notes,
                createdDate: load.created_date
            }));

            return { success: true, data: transformedData };
        } catch (error) {
            console.error('Error fetching loads:', error);
            return { success: false, error: error.message };
        }
    },

    // Create new load
    async createLoad(loadData) {
        try {
            // Generate ID using Supabase function
            const { data: idData, error: idError } = await supabase.rpc('generate_load_id');
            if (idError) throw idError;

            const insertData = {
                id: idData,
                customer_id: loadData.customerId || null,
                customer_name: loadData.customerName,
                carrier_id: loadData.carrierId || null,
                carrier_name: loadData.carrierName,
                agent_id: loadData.agentId,
                agent_name: loadData.agentName,
                pickup_address: loadData.pickupAddress,
                delivery_address: loadData.deliveryAddress,
                rate: loadData.rate,
                carrier_cost: loadData.carrierCost || 0,
                trip_distance: loadData.tripDistance || 0,
                status: loadData.status,
                equipment_type: loadData.equipmentType,
                appointment_date: loadData.appointmentDate,
                reference_number: loadData.referenceNumber || null,
                notes: loadData.notes || null
            };

            const { data, error } = await supabase
                .from('loads')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;

            // Transform back
            const transformed = {
                id: data.id,
                customerId: data.customer_id,
                customerName: data.customer_name,
                carrierId: data.carrier_id,
                carrierName: data.carrier_name,
                agentId: data.agent_id,
                agentName: data.agent_name,
                pickupAddress: data.pickup_address,
                deliveryAddress: data.delivery_address,
                rate: parseFloat(data.rate),
                carrierCost: parseFloat(data.carrier_cost),
                tripDistance: data.trip_distance,
                status: data.status,
                equipmentType: data.equipment_type,
                appointmentDate: data.appointment_date,
                referenceNumber: data.reference_number,
                notes: data.notes,
                createdDate: data.created_date
            };

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error creating load:', error);
            return { success: false, error: error.message };
        }
    },

    // Update existing load
    async updateLoad(loadId, loadData) {
        try {
            const updateData = {
                customer_id: loadData.customerId || null,
                customer_name: loadData.customerName,
                carrier_id: loadData.carrierId || null,
                carrier_name: loadData.carrierName,
                agent_id: loadData.agentId,
                agent_name: loadData.agentName,
                pickup_address: loadData.pickupAddress,
                delivery_address: loadData.deliveryAddress,
                rate: loadData.rate,
                carrier_cost: loadData.carrierCost || 0,
                trip_distance: loadData.tripDistance || 0,
                status: loadData.status,
                equipment_type: loadData.equipmentType,
                appointment_date: loadData.appointmentDate,
                reference_number: loadData.referenceNumber || null,
                notes: loadData.notes || null,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('loads')
                .update(updateData)
                .eq('id', loadId)
                .select()
                .single();

            if (error) throw error;

            // Transform back
            const transformed = {
                id: data.id,
                customerId: data.customer_id,
                customerName: data.customer_name,
                carrierId: data.carrier_id,
                carrierName: data.carrier_name,
                agentId: data.agent_id,
                agentName: data.agent_name,
                pickupAddress: data.pickup_address,
                deliveryAddress: data.delivery_address,
                rate: parseFloat(data.rate),
                carrierCost: parseFloat(data.carrier_cost),
                tripDistance: data.trip_distance,
                status: data.status,
                equipmentType: data.equipment_type,
                appointmentDate: data.appointment_date,
                referenceNumber: data.reference_number,
                notes: data.notes,
                createdDate: data.created_date
            };

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error updating load:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete load
    async deleteLoad(loadId) {
        try {
            const { error } = await supabase
                .from('loads')
                .delete()
                .eq('id', loadId);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Error deleting load:', error);
            return { success: false, error: error.message };
        }
    }
};
