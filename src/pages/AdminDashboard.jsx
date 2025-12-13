import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        try {
            const { data, error } = await supabase
                .from('carrier_applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (err) {
            console.error("Error fetching applications:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
                        Carrier Applications
                    </h1>
                    <button
                        onClick={fetchApplications}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition border border-gray-700"
                    >
                        Result
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6">
                        Error: {error}
                    </div>
                )}

                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">MC / DOT</th>
                                    <th className="px-6 py-4">Fleet</th>
                                    <th className="px-6 py-4">Submitted</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {applications.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            No applications found.
                                        </td>
                                    </tr>
                                ) : (
                                    applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-gray-700/30 transition duration-150">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{app.company_name}</div>
                                                <div className="text-sm text-gray-400">{app.primary_email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-300">{app.primary_contact_name}</div>
                                                <div className="text-sm text-gray-500">{app.primary_phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                <div>MC: {app.mc_number || '—'}</div>
                                                <div>DOT: {app.dot_number || '—'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="text-gray-300">{app.number_of_trucks || 0} Trucks</div>
                                                <div className="text-gray-500 text-xs">
                                                    {[
                                                        app.equipment_dryvan && 'Van',
                                                        app.equipment_reefer && 'Reefer',
                                                        app.equipment_flatbed && 'Flatbed'
                                                    ].filter(Boolean).join(', ')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
