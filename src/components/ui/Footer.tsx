import React from "react";
import type { Tab } from "~/components/MoneySaver";

interface FooterProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  showWallet?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ activeTab, setActiveTab, showWallet = false }) => {
  const tabs = [
    { id: 'dashboard' as Tab, icon: '📊', label: 'Dashboard' },
    { id: 'goals' as Tab, icon: '🎯', label: 'Goals' },
    { id: 'expenses' as Tab, icon: '💸', label: 'Expenses' },
    { id: 'analytics' as Tab, icon: '📈', label: 'Analytics' },
  ];

  return (
  <div className="fixed bottom-0 left-0 right-0 mx-4 mb-4 bg-gray-100 dark:bg-gray-800 border-[3px] border-double border-purple-500 px-2 py-2 rounded-lg z-50">
    <div className="flex justify-around items-center h-14">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === tab.id ? 'text-purple-500' : 'text-gray-500'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-xs mt-1">{tab.label}</span>
        </button>
      ))}
    </div>
  </div>
  );
};
