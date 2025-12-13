import { motion } from 'framer-motion';

const KPIBox = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const colorClasses = {
        blue: 'from-blue-600/20 to-blue-900/20 border-blue-500/30',
        green: 'from-green-600/20 to-green-900/20 border-green-500/30',
        purple: 'from-purple-600/20 to-purple-900/20 border-purple-500/30',
        orange: 'from-orange-600/20 to-orange-900/20 border-orange-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold">{value}</h3>
                    {trend && (
                        <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className="p-3 bg-white/10 rounded-lg">
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default KPIBox;
