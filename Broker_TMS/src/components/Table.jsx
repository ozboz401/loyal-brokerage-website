import { Edit, Trash2, Eye } from 'lucide-react';

const Table = ({ columns, data, actions, onAction }) => {
    return (
        <div className="overflow-x-auto bg-[#111827] rounded-xl border border-gray-800 shadow-lg">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-800/50 border-b border-gray-700">
                        {columns.map((col, index) => (
                            <th key={index} className="p-4 text-sm font-semibold text-gray-300">
                                {col.header}
                            </th>
                        ))}
                        {actions && <th className="p-4 text-sm font-semibold text-gray-300 text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors duration-150"
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="p-4 text-sm text-gray-400">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {actions.includes('view') && (
                                                <button
                                                    onClick={() => onAction('view', row)}
                                                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            )}
                                            {actions.includes('edit') && (
                                                <button
                                                    onClick={() => onAction('edit', row)}
                                                    className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                            {actions.includes('delete') && (
                                                <button
                                                    onClick={() => onAction('delete', row)}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className="p-8 text-center text-gray-500">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
