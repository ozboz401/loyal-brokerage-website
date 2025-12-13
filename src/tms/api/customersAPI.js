// Supabase adapter for Customers module
import { supabase } from '../../lib/supabase';

export const customersAPI = {
    // Fetch all customers with optional filters
    async fetchCustomers(filters = {}) {
        try {
            let query = supabase
                .from('tms_customers')
                .select('*')
                .order('created_at', { ascending: false });

            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,contact_name.ilike.%${filters.search}%`);
            }

            if (filters.creditStatus) {
                query = query.eq('credit_status', filters.creditStatus);
            }

            const { data, error } = await query;
            if (error) throw error;

            // Transform to camelCase
            const transformed = data.map(customer => ({
                id: customer.id,
                name: customer.name,
                contactName: customer.contact_name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                paymentTerms: customer.payment_terms,
                creditStatus: customer.credit_status,
                avgRate: customer.avg_rate,
                createdAt: customer.created_at,
                updatedAt: customer.updated_at
            }));

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error fetching customers:', error);
            return { success: false, error: error.message };
        }
    },

    // Create new customer
    async createCustomer(customerData) {
        try {
            const insertData = {
                name: customerData.name,
                contact_name: customerData.contactName || null,
                email: customerData.email || null,
                phone: customerData.phone || null,
                address: customerData.address || null,
                payment_terms: customerData.paymentTerms || 'Net 30',
                credit_status: customerData.creditStatus || 'Approved',
                avg_rate: customerData.avgRate || null
            };

            const { data, error } = await supabase
                .from('tms_customers')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;

            const transformed = {
                id: data.id,
                name: data.name,
                contactName: data.contact_name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                paymentTerms: data.payment_terms,
                creditStatus: data.credit_status,
                avgRate: data.avg_rate,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            };

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error creating customer:', error);
            return { success: false, error: error.message };
        }
    },

    // Update customer
    async updateCustomer(id, updates) {
        try {
            const updateData = {
                name: updates.name,
                contact_name: updates.contactName || null,
                email: updates.email || null,
                phone: updates.phone || null,
                address: updates.address || null,
                payment_terms: updates.paymentTerms,
                credit_status: updates.creditStatus,
                avg_rate: updates.avgRate || null,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('tms_customers')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            const transformed = {
                id: data.id,
                name: data.name,
                contactName: data.contact_name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                paymentTerms: data.payment_terms,
                creditStatus: data.credit_status,
                avgRate: data.avg_rate,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            };

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error updating customer:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete customer
    async deleteCustomer(id) {
        try {
            const { error } = await supabase
                .from('tms_customers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting customer:', error);
            return { success: false, error: error.message };
        }
    },

    // Get customer with related loads
    async getCustomerWithLoads(customerId) {
        try {
            const { data: customer, error: customerError } = await supabase
                .from('tms_customers')
                .select('*')
                .eq('id', customerId)
                .single();

            if (customerError) throw customerError;

            const { data: loads, error: loadsError } = await supabase
                .from('loads')
                .select('*')
                .eq('customer_id', customerId)
                .order('created_at', { ascending: false });

            if (loadsError) throw loadsError;

            return {
                success: true,
                data: {
                    customer: {
                        id: customer.id,
                        name: customer.name,
                        contactName: customer.contact_name,
                        email: customer.email,
                        phone: customer.phone,
                        address: customer.address,
                        paymentTerms: customer.payment_terms,
                        creditStatus: customer.credit_status,
                        avgRate: customer.avg_rate
                    },
                    loads: loads.map(load => ({
                        id: load.id,
                        pickupAddress: load.pickup_address,
                        deliveryAddress: load.delivery_address,
                        rate: load.rate,
                        status: load.status,
                        createdAt: load.created_at
                    }))
                }
            };
        } catch (error) {
            console.error('Error fetching customer with loads:', error);
            return { success: false, error: error.message };
        }
    }
};
