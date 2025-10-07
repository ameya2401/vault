import { Code2, LogOut } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLogout?: () => void;
}

export default function Navigation({ activeTab, onTabChange, onLogout }: NavigationProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'editor', label: 'Code Editor' },
    { id: 'indenter', label: 'Indenter' },
    { id: 'saved', label: 'Saved Files' }
  ];

  return (
    <nav className="bg-black border-b-2 border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="w-7 h-7 text-white" />
            <h1 className="text-xl font-bold text-white font-['Poppins']">
              Smart Code Notepad
            </h1>
          </div>

          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-5 py-2 font-semibold transition-colors font-['Poppins'] ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'bg-black text-white border-2 border-gray-800 hover:border-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
            
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-colors rounded font-['Poppins']"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}