// Supabase adapter for Accounting module
import { supabase } from '../../lib/supabase';

export const accountingAPI = {
    // ===== INVOICES =====

    async fetchInvoices(filters = {}) {
        try {
            let query = supabase
                .from('invoices')
                .select('*')
                .order('created_at', { ascending: false });

            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.customerId) {
                query = query.eq('customer_id', filters.customerId);
            }

            const { data, error } = await query;
            if (error) throw error;

            const transformed = data.map(inv => ({
                id: inv.id,
                loadId: inv.load_id,
                customerId: inv.customer_id,
                customerName: inv.customer_name,
                amount: parseFloat(inv.amount),
                status: inv.status,
                dateSent: inv.date_sent,
                datePaid: inv.date_paid,
                dueDate: inv.due_date,
                notes: inv.notes,
                createdAt: inv.created_at
            }));

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error fetching invoices:', error);
            return { success: false, error: error.message };
        }
    },

    async createInvoice(invoiceData) {
        try {
            const { data: invoiceId, error: idError } = await supabase.rpc('generate_invoice_id');
            if (idError) throw idError;

            const insertData = {
                id: invoiceId,
                load_id: invoiceData.loadId || null,
                customer_id: invoiceData.customerId,
                customer_name: invoiceData.customerName,
                amount: invoiceData.amount,
                status: invoiceData.status || 'Pending',
                date_sent: invoiceData.dateSent || new Date().toISOString().split('T')[0],
                due_date: invoiceData.dueDate || null,
                notes: invoiceData.notes || null
            };

            const { data, error } = await supabase
                .from('invoices')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;

            return {
                success: true,
                data: {
                    id: data.id,
                    loadId: data.load_id,
                    customerId: data.customer_id,
                    customerName: data.customer_name,
                    amount: parseFloat(data.amount),
                    status: data.status,
                    dateSent: data.date_sent
                }
            };
        } catch (error) {
            console.error('Error creating invoice:', error);
            return { success: false, error: error.message };
        }
    },

    async updateInvoice(id, updates) {
        try {
            const updateData = {
                status: updates.status,
                date_paid: updates.datePaid || null,
                notes: updates.notes || null
            };

            const { data, error } = await supabase
                .from('invoices')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return {
                success: true,
                data: {
                    id: data.id,
                    status: data.status,
                    datePaid: data.date_paid
                }
            };
        } catch (error) {
            console.error('Error updating invoice:', error);
            return { success: false, error: error.message };
        }
    },

    // ===== PAYMENTS =====

    async addPayment(paymentData) {
        try {
            const insertData = {
                invoice_id: paymentData.invoiceId,
                amount: paymentData.amount,
                payment_date: paymentData.paymentDate || new Date().toISOString().split('T')[0],
                payment_method: paymentData.paymentMethod,
                reference_number: paymentData.referenceNumber || null,
                notes: paymentData.notes || null
            };

            const { data, error } = await supabase
                .from('payments')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;

            // Update invoice to Paid if fully paid
            if (paymentData.markAsPaid) {
                await supabase
                    .from('invoices')
                    .update({ status: 'Paid', date_paid: insertData.payment_date })
                    .eq('id', paymentData.invoiceId);
            }

            return { success: true, data: { id: data.id } };
        } catch (error) {
            console.error('Error adding payment:', error);
            return { success: false, error: error.message };
        }
    },

    // ===== COMMISSIONS =====

    async calculateCommissions(loadId) {
        try {
            // Get load details
            const { data: load, error: loadError } = await supabase
                .from('loads')
                .select('*')
                .eq('id', loadId)
                .single();

            if (loadError) throw loadError;

            // Get agent commission rate
            const { data: agent, error: agentError } = await supabase
                .from('tms_agents')
                .select('commission_rate')
                .eq('id', load.agent_id)
                .single();

            if (agentError) throw agentError;

            const grossProfit = parseFloat(load.rate) - parseFloat(load.carrier_cost);
            const commissionAmount = (grossProfit * parseFloat(agent.commission_rate)) / 100;

            // Insert commission record
            const { data: commission, error: commError } = await supabase
                .from('agent_commissions')
                .insert([{
                    load_id: loadId,
                    agent_id: load.agent_id,
                    agent_name: load.agent_name,
                    gross_profit: grossProfit,
                    commission_rate: agent.commission_rate,
                    commission_amount: commissionAmount,
                    status: 'Pending'
                }])
                .select()
                .single();

            if (commError) throw commError;

            return {
                success: true,
                data: {
                    id: commission.id,
                    grossProfit,
                    commissionAmount
                }
            };
        } catch (error) {
            console.error('Error calculating commission:', error);
            return { success: false, error: error.message };
        }
    },

    async fetchCommissions(filters = {}) {
        try {
            let query = supabase
                .from('agent_commissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (filters.agentId) {
                query = query.eq('agent_id', filters.agentId);
            }
            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            const { data, error } = await query;
            if (error) throw error;

            const transformed = data.map(comm => ({
                id: comm.id,
                loadId: comm.load_id,
                agentId: comm.agent_id,
                agentName: comm.agent_name,
                grossProfit: parseFloat(comm.gross_profit),
                commissionRate: parseFloat(comm.commission_rate),
                commissionAmount: parseFloat(comm.commission_amount),
                status: comm.status,
                paidDate: comm.paid_date,
                createdAt: comm.created_at
            }));

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error fetching commissions:', error);
            return { success: false, error: error.message };
        }
    }
};
