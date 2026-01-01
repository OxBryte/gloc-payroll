import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Popular icons list - you can expand this with more icons from lucide-react
const POPULAR_ICONS = [
  "CheckCircle2", "XCircle", "AlertCircle", "Info", "Star", "Heart",
  "Bookmark", "Flag", "Tag", "Folder", "File", "Image", "Video", "Music",
  "Settings", "User", "Users", "Mail", "Phone", "MessageSquare", "Bell",
  "Calendar", "Clock", "Timer", "Zap", "Bolt", "Fire", "Lightbulb",
  "Target", "Trophy", "Award", "Gift", "ShoppingCart", "CreditCard",
  "DollarSign", "TrendingUp", "TrendingDown", "BarChart", "PieChart",
  "Home", "Building", "MapPin", "Globe", "Link", "Share", "Download",
  "Upload", "Save", "Edit", "Trash2", "Copy", "Cut", "Paste", "Undo",
  "Redo", "Search", "Filter", "SortAsc", "SortDesc", "List", "Grid",
  "Menu", "MoreVertical", "MoreHorizontal", "Plus", "Minus", "X",
  "Check", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "ChevronRight",
  "ChevronLeft", "ChevronUp", "ChevronDown", "Play", "Pause", "Stop",
  "SkipForward", "SkipBack", "Volume2", "VolumeX", "Mic", "Camera",
  "Eye", "EyeOff", "Lock", "Unlock", "Key", "Shield", "ShieldCheck",
  "AlertTriangle", "HelpCircle", "QuestionMarkCircle", "CheckSquare",
  "Square", "Circle", "Triangle", "Hexagon", "Pentagon", "Diamond",
  "Code", "Terminal", "Database", "Server", "Cloud", "Wifi", "Bluetooth",
  "Battery", "BatteryCharging", "Power", "Sun", "Moon", "CloudRain",
  "CloudSnow", "Wind", "Droplet", "Flame", "Leaf", "Tree", "Flower",
  "Bug", "Wand2", "Sparkles", "Rocket", "Plane", "Car", "Bike", "Ship",
  "Train", "Bus", "Truck", "Package", "Box", "Archive", "Briefcase",
  "Laptop", "Monitor", "Smartphone", "Tablet", "Mouse", "Keyboard",
  "Headphones", "Speaker", "Radio", "Tv", "Gamepad2", "Dice1", "Dice2",
  "Dice3", "Dice4", "Dice5", "Dice6", "Puzzle", "PuzzlePiece", "Palette",
  "Brush", "PenTool", "Eraser", "Scissors", "Ruler", "Compass", "Map",
  "Navigation", "Route", "Footprints", "Activity", "Pulse", "HeartPulse",
  "Stethoscope", "Pill", "Syringe", "Bandage", "Cross", "Church", "School",
  "GraduationCap", "Book", "BookOpen", "Library", "Newspaper", "FileText",
  "FileCode", "FileJson", "FileSpreadsheet", "FileImage", "FileVideo",
  "FileAudio", "FileArchive", "FolderOpen", "FolderPlus", "FolderMinus",
  "FolderX", "FolderKanban", "FolderGit", "FolderGit2", "FolderSearch",
  "FolderSync", "FolderLock", "FolderHeart", "FolderStar", "FolderUp",
  "FolderDown", "FolderInput", "FolderOutput", "FolderRoot", "FolderTree",
  "FolderSymlink", "FolderCheck", "FolderEdit", "FolderX2", "FolderPlus2",
  "FolderMinus2", "FolderKanban2", "FolderGit2", "FolderSearch2", "FolderSync2",
  "FolderLock2", "FolderHeart2", "FolderStar2", "FolderUp2", "FolderDown2",
  "FolderInput2", "FolderOutput2", "FolderRoot2", "FolderTree2", "FolderSymlink2",
  "FolderCheck2", "FolderEdit2", "FolderX3", "FolderPlus3", "FolderMinus3",
  "FolderKanban3", "FolderGit3", "FolderGit23", "FolderSearch3", "FolderSync3",
  "FolderLock3", "FolderHeart3", "FolderStar3", "FolderUp3", "FolderDown3",
  "FolderInput3", "FolderOutput3", "FolderRoot3", "FolderTree3", "FolderSymlink3",
  "FolderCheck3", "FolderEdit3", "FolderX4", "FolderPlus4", "FolderMinus4",
  "FolderKanban4", "FolderGit4", "FolderGit24", "FolderSearch4", "FolderSync4",
  "FolderLock4", "FolderHeart4", "FolderStar4", "FolderUp4", "FolderDown4",
  "FolderInput4", "FolderOutput4", "FolderRoot4", "FolderTree4", "FolderSymlink4",
  "FolderCheck4", "FolderEdit4", "FolderX5", "FolderPlus5", "FolderMinus5",
  "FolderKanban5", "FolderGit5", "FolderGit25", "FolderSearch5", "FolderSync5",
  "FolderLock5", "FolderHeart5", "FolderStar5", "FolderUp5", "FolderDown5",
  "FolderInput5", "FolderOutput5", "FolderRoot5", "FolderTree5", "FolderSymlink5",
  "FolderCheck5", "FolderEdit5"
];

// Filter to only include icons that actually exist in lucide-react
const AVAILABLE_ICONS = POPULAR_ICONS.filter(iconName => {
  try {
    return LucideIcons[iconName] !== undefined;
  } catch {
    return false;
  }
});

export default function IconPicker({ selectedIcon, onSelectIcon, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return AVAILABLE_ICONS;
    }
    const query = searchQuery.toLowerCase();
    return AVAILABLE_ICONS.filter(iconName =>
      iconName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleIconSelect = (iconName) => {
    onSelectIcon(iconName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Select Icon</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-c-color/20 focus:border-c-color transition-all outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-3">
              {filteredIcons.map((iconName) => {
                const IconComponent = LucideIcons[iconName];
                if (!IconComponent) return null;

                const isSelected = selectedIcon === iconName;

                return (
                  <button
                    key={iconName}
                    onClick={() => handleIconSelect(iconName)}
                    className={`
                      p-3 rounded-lg border-2 transition-all
                      flex items-center justify-center
                      hover:bg-gray-50 hover:border-c-color
                      ${isSelected 
                        ? "bg-c-color/10 border-c-color" 
                        : "border-gray-200"
                      }
                    `}
                    title={iconName}
                  >
                    <IconComponent 
                      className={`w-5 h-5 ${
                        isSelected ? "text-c-color" : "text-gray-600"
                      }`} 
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No icons found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            {filteredIcons.length} icon{filteredIcons.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>
    </div>
  );
}

