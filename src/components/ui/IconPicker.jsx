import React, { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Curated list of popular icons from lucide-react
const POPULAR_ICONS = [
  "CheckCircle2", "XCircle", "AlertCircle", "Info", "Star", "Heart", "Bookmark",
  "Flag", "Tag", "Folder", "File", "Image", "Video", "Music", "Settings",
  "User", "Users", "Mail", "Phone", "MessageSquare", "Bell", "Calendar",
  "Clock", "Timer", "Zap", "Bolt", "Fire", "Lightbulb", "Target", "Trophy",
  "Award", "Gift", "ShoppingCart", "CreditCard", "DollarSign", "TrendingUp",
  "TrendingDown", "BarChart", "PieChart", "Home", "Building", "MapPin",
  "Globe", "Link", "Share", "Download", "Upload", "Save", "Edit", "Trash2",
  "Copy", "Paste", "Undo", "Redo", "Search", "Filter", "List", "Grid",
  "Menu", "MoreVertical", "MoreHorizontal", "Plus", "Minus", "X", "Check",
  "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "ChevronRight",
  "ChevronLeft", "ChevronUp", "ChevronDown", "Play", "Pause", "Stop",
  "Volume2", "VolumeX", "Mic", "Camera", "Eye", "EyeOff", "Lock", "Unlock",
  "Key", "Shield", "ShieldCheck", "AlertTriangle", "HelpCircle",
  "CheckSquare", "Square", "Circle", "Triangle", "Code", "Terminal",
  "Database", "Server", "Cloud", "Wifi", "Battery", "BatteryCharging",
  "Power", "Sun", "Moon", "CloudRain", "CloudSnow", "Wind", "Droplet",
  "Flame", "Leaf", "Tree", "Bug", "Wand2", "Sparkles", "Rocket", "Plane",
  "Car", "Bike", "Ship", "Train", "Bus", "Truck", "Package", "Box",
  "Archive", "Briefcase", "Laptop", "Monitor", "Smartphone", "Tablet",
  "Mouse", "Keyboard", "Headphones", "Speaker", "Radio", "Tv", "Gamepad2",
  "Puzzle", "Palette", "Brush", "PenTool", "Eraser", "Scissors", "Map",
  "Navigation", "Activity", "Pulse", "HeartPulse", "Book", "BookOpen",
  "Library", "Newspaper", "FileText", "FileCode", "FileJson", "FileImage",
  "FileVideo", "FileAudio", "FolderOpen", "FolderPlus", "FolderMinus",
  "FolderX", "FolderKanban", "FolderGit", "FolderSearch", "FolderSync",
  "FolderLock", "FolderHeart", "FolderStar", "Coffee", "Utensils",
  "ShoppingBag", "Store", "Building2", "Factory", "Warehouse", "Hospital",
  "Hotel", "Anchor", "Sailboat", "Ambulance", "Firetruck", "Tractor",
  "Scooter", "Skateboard", "Wheelchair", "Baby", "Child", "Gamepad",
  "Joystick", "PuzzlePiece", "Chess", "ChessKing", "ChessQueen", "ChessRook",
  "ChessBishop", "ChessKnight", "ChessPawn", "Music2", "Music3", "Music4",
  "Volume1", "MicOff", "VideoOff", "CameraOff", "Images", "Film",
  "FilmStrip", "Clapperboard", "MonitorSpeaker", "Computer", "MousePointer",
  "MousePointer2", "Touchpad", "HardDrive", "Cpu", "MemoryStick", "Usb",
  "SdCard", "Cd", "Disc", "FloppyDisk", "SaveAll", "FileCheck", "FileX",
  "FilePlus", "FileMinus", "FileEdit", "FileSearch", "FileQuestion",
  "FileWarning", "FileInfo", "FileLock", "FileUp", "FileDown", "FileInput",
  "FileOutput", "FileSymlink", "FileHeart", "FileStar", "FileClock",
  "BookMarked", "BookCheck", "BookX", "BookPlus", "BookMinus", "BookEdit",
  "BookLock", "BookHeart", "BookStar", "GraduationCap", "School", "Scroll",
  "ScrollText", "FileType", "Type", "Text", "AlignLeft", "AlignCenter",
  "AlignRight", "AlignJustify", "Bold", "Italic", "Underline", "Strikethrough",
  "ListOrdered", "ListChecks", "ListTodo", "ListX", "ListPlus", "ListMinus",
  "ListStar", "ListHeart", "ListMusic", "ListVideo", "ListImage", "ListCode",
  "Quote", "Code2", "Brackets", "Braces", "Parentheses", "Hash", "AtSign",
  "Percent", "Asterisk", "Slash", "Backslash", "Equal", "GreaterThan",
  "LessThan", "Divide", "CheckCircle", "XCircle2", "QuestionMark",
  "QuestionMarkCircle", "ExclamationMark", "LightbulbOff", "ZapOff", "BoltOff",
  "FlameOff", "DropletOff", "Snowflake", "CloudLightning", "CloudDrizzle",
  "CloudFog", "CloudHail", "CloudWind", "Sunrise", "Sunset", "MoonStar",
  "StarOff", "Sparkle", "Wand", "Magic", "MagicWand", "CrystalBall", "Crystal",
  "Gem", "Diamond", "Hexagon", "Pentagon", "Octagon", "Square2", "Circle2",
  "Triangle2", "Rectangle", "RectangleHorizontal", "RectangleVertical",
  "Ellipse", "Oval", "Rhombus", "Trapezoid", "Parallelogram", "Cross",
  "Plus2", "Minus2", "X2", "Check2", "ArrowUpLeft", "ArrowUpRight",
  "ArrowDownLeft", "ArrowDownRight", "ArrowUpDown", "ArrowLeftRight",
  "ArrowUpCircle", "ArrowDownCircle", "ArrowLeftCircle", "ArrowRightCircle",
  "ArrowUpSquare", "ArrowDownSquare", "ArrowLeftSquare", "ArrowRightSquare",
  "ChevronsUp", "ChevronsDown", "ChevronsLeft", "ChevronsRight", "MoveUp",
  "MoveDown", "MoveLeft", "MoveRight", "Move", "RotateCw", "RotateCcw",
  "FlipHorizontal", "FlipVertical", "Scale", "Resize", "Maximize", "Minimize",
  "Fullscreen", "FullscreenExit", "AspectRatio", "Fit", "Crop", "ZoomIn",
  "ZoomOut", "Zoom"
];

// Filter to only include icons that actually exist in lucide-react
const getAvailableIcons = () => {
  const available = [];
  for (const iconName of POPULAR_ICONS) {
    if (LucideIcons[iconName] && typeof LucideIcons[iconName] === "function") {
      available.push(iconName);
    }
  }
  return available;
};

const AVAILABLE_ICONS = getAvailableIcons();

// Debug: Log available icons count
if (typeof window !== "undefined") {
  console.log("Available icons:", AVAILABLE_ICONS.length);
}

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

