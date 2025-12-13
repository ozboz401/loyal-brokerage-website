import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { agentsAPI } from '../api/agentsAPI';
import AgentModal from "../../components/agents/AgentModal";

const Agents = () => {
    const { isAdmin } = useAuth();

    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Explicit State as requested
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedAgent, setSelectedAgent] = useState(null);

    // Load agents
    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = async () => {
        setLoading(true);
        const result = await agentsAPI.fetchAgents({ status: 'Active' });
        if (result.success) {
            setAgents(result.data);
        }
        setLoading(false);
    };

    const handleAddClick = () => {
        setModalMode("add");
        setSelectedAgent(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (agent) => {
        setModalMode("edit");
        setSelectedAgent(agent);
        setIsModalOpen(true);
    };

    const handleDelete = async (agent) => {
        if (!confirm(`Delete agent ${agent.name}?`)) return;

        const result = await agentsAPI.deleteAgent(agent.id);
        if (result.success) {
            setAgents(prev => prev.filter(a => a.id !== agent.id));
        } else {
            alert('Error deleting agent: ' + result.error);
        }
    };

    // If not admin, show access restricted message
    if (!isAdmin()) {
        return (
            <div className="space-y-6">
                {/* Access Restricted Message */}
                <div className="bg-[#111827] p-12 rounded-xl border border-gray-800 text-center">
                    <ShieldAlert size={64} className="mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
                    <p className="text-gray-400 mb-4">
                        Agent Management is only accessible to administrators.
                    </p>
                    <p className="text-sm text-gray-500">
                        Please contact your administrator for agent-related requests.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Agent Management</h1>
                <p className="text-gray-400">Manage agents, commission settings, and performance tracking</p>
            </div>

            {/* Agent Management Table */}
            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Agents</h3>
                    <button
                        onClick={handleAddClick}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={18} />
                        <span>Add New Agent</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Agent Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Phone</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Commission</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Hire Date</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-400">
                                        Loading agents...
                                    </td>
                                </tr>
                            ) : agents.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-400">
                                        No agents found
                                    </td>
                                </tr>
                            ) : (
                                agents.map((agent) => (
                                    <tr key={agent.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors group">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold">
                                                    {agent.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="font-medium text-white">{agent.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-400">{agent.email}</td>
                                        <td className="py-3 px-4 text-gray-400">{agent.phone || '-'}</td>
                                        <td className="py-3 px-4 text-green-400 font-medium">
                                            {agent.commissionRate}%
                                        </td>
                                        <td className="py-3 px-4 text-gray-400">
                                            {agent.hireDate ? new Date(agent.hireDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs ${agent.status === 'Active'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {agent.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditClick(agent)}
                                                    className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(agent)}
                                                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Agent Modal */}
            <AgentModal
                isOpen={isModalOpen}
                mode={modalMode}
                agent={selectedAgent}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    loadAgents();
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};

export default Agents;
