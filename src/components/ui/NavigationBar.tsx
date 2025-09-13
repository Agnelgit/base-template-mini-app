"use client";

import { Button } from "./Button";

interface NavigationBarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function NavigationBar({ activeTab = "dashboard", onTabChange }: NavigationBarProps) {

  const sections = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "goals", label: "Goals", icon: "🎯" },
    { id: "expenses", label: "Expenses", icon: "💸" },
  ];

  const handleSectionClick = (sectionId: string) => {
    if (onTabChange) {
      onTabChange(sectionId);
    }
    console.log(`Navigated to: ${sectionId}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {sections.map((section) => (
          <Button
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 min-w-0 flex-1 text-xs ${
              activeTab === section.id 
                ? "bg-[#7C65C1] text-white" 
                : "bg-transparent text-muted-foreground hover:bg-muted"
            }`}
          >
            <span className="text-lg">{section.icon}</span>
            <span className="text-xs font-medium truncate">{section.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
