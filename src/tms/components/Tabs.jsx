import { useState } from 'react';

const Tabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            {/* Tab Headers */}
            <div className="flex border-b border-gray-800 mb-6">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${activeTab === index
                                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Tabs;
