import { motion } from 'framer-motion';

const CRMWidget = ({ title, value, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
        blue: 'from-[#111827] to-[#1F2937] border-blue-500/20',
        green: 'from-[#111827] to-[#1F2937] border-green-500/20',
        purple: 'from-[#111827] to-[#1F2937] border-purple-500/20',
        orange: 'from-[#111827] to-[#1F2937] border-orange-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-5 transition-all duration-300`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 mb-1">{title}</p>
                    <h4 className="text-2xl font-bold">{value}</h4>
                </div>
                {Icon && (
                    <div className="p-2 bg-white/5 rounded-lg">
                        <Icon size={20} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CRMWidget;
