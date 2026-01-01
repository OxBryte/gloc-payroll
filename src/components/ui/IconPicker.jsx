import React, { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Popular icons list - comprehensive selection from lucide-react
const POPULAR_ICONS = [
  "CheckCircle2", "XCircle", "AlertCircle", "Info", "Star", "Heart", "Bookmark",
  "Flag", "Tag", "Folder", "File", "Image", "Video", "Music", "Settings",
  "User", "Users", "Mail", "Phone", "MessageSquare", "Bell", "Calendar",
  "Clock", "Timer", "Zap", "Bolt", "Fire", "Lightbulb", "Target", "Trophy",
  "Award", "Gift", "ShoppingCart", "CreditCard", "DollarSign", "TrendingUp",
  "TrendingDown", "BarChart", "PieChart", "Home", "Building", "MapPin",
  "Globe", "Link", "Share", "Download", "Upload", "Save", "Edit", "Trash2",
  "Copy", "Cut", "Paste", "Undo", "Redo", "Search", "Filter", "SortAsc",
  "SortDesc", "List", "Grid", "Menu", "MoreVertical", "MoreHorizontal",
  "Plus", "Minus", "X", "Check", "ArrowRight", "ArrowLeft", "ArrowUp",
  "ArrowDown", "ChevronRight", "ChevronLeft", "ChevronUp", "ChevronDown",
  "Play", "Pause", "Stop", "SkipForward", "SkipBack", "Volume2", "VolumeX",
  "Mic", "Camera", "Eye", "EyeOff", "Lock", "Unlock", "Key", "Shield",
  "ShieldCheck", "AlertTriangle", "HelpCircle", "QuestionMarkCircle",
  "CheckSquare", "Square", "Circle", "Triangle", "Hexagon", "Pentagon",
  "Diamond", "Code", "Terminal", "Database", "Server", "Cloud", "Wifi",
  "Bluetooth", "Battery", "BatteryCharging", "Power", "Sun", "Moon",
  "CloudRain", "CloudSnow", "Wind", "Droplet", "Flame", "Leaf", "Tree",
  "Flower", "Bug", "Wand2", "Sparkles", "Rocket", "Plane", "Car", "Bike",
  "Ship", "Train", "Bus", "Truck", "Package", "Box", "Archive", "Briefcase",
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
  "FolderSymlink", "FolderCheck", "FolderEdit", "Coffee", "Utensils",
  "ShoppingBag", "Store", "Building2", "Factory", "Warehouse", "Hospital",
  "Hotel", "PlaneLanding", "PlaneTakeoff", "Ship", "Anchor", "Sailboat",
  "CarFront", "CarTaxiFront", "Ambulance", "Firetruck", "Tractor", "Bike",
  "Scooter", "Skateboard", "Wheelchair", "Baby", "Child", "BabyCarriage",
  "Gamepad", "Gamepad2", "Joystick", "Dice1", "Dice2", "Dice3", "Dice4",
  "Dice5", "Dice6", "Puzzle", "PuzzlePiece", "Chess", "ChessKing", "ChessQueen",
  "ChessRook", "ChessBishop", "ChessKnight", "ChessPawn", "Music", "Music2",
  "Music3", "Music4", "Headphones", "Radio", "Speaker", "Volume1", "Volume2",
  "VolumeX", "Mic", "MicOff", "Video", "VideoOff", "Camera", "CameraOff",
  "Image", "Images", "Film", "FilmStrip", "Clapperboard", "Tv", "Monitor",
  "MonitorSpeaker", "Smartphone", "Tablet", "Laptop", "Computer", "Mouse",
  "Keyboard", "MousePointer", "MousePointer2", "Touchpad", "HardDrive",
  "HardDriveIcon", "Cpu", "MemoryStick", "Usb", "SdCard", "Cd", "Disc",
  "FloppyDisk", "Save", "SaveAll", "Folder", "FolderOpen", "FolderPlus",
  "FolderMinus", "FolderX", "FolderKanban", "FolderGit", "FolderGit2",
  "FolderSearch", "FolderSync", "FolderLock", "FolderHeart", "FolderStar",
  "FolderUp", "FolderDown", "FolderInput", "FolderOutput", "FolderRoot",
  "FolderTree", "FolderSymlink", "FolderCheck", "FolderEdit", "File",
  "FileText", "FileCode", "FileJson", "FileSpreadsheet", "FileImage",
  "FileVideo", "FileAudio", "FileArchive", "FileCheck", "FileX", "FilePlus",
  "FileMinus", "FileEdit", "FileSearch", "FileQuestion", "FileWarning",
  "FileInfo", "FileLock", "FileUp", "FileDown", "FileInput", "FileOutput",
  "FileSymlink", "FileHeart", "FileStar", "FileClock", "FileCheck2",
  "FileX2", "FilePlus2", "FileMinus2", "FileEdit2", "FileSearch2",
  "FileQuestion2", "FileWarning2", "FileInfo2", "FileLock2", "FileUp2",
  "FileDown2", "FileInput2", "FileOutput2", "FileSymlink2", "FileHeart2",
  "FileStar2", "FileClock2", "Book", "BookOpen", "BookMarked", "BookCheck",
  "BookX", "BookPlus", "BookMinus", "BookEdit", "BookLock", "BookHeart",
  "BookStar", "Library", "GraduationCap", "School", "University", "BookOpenCheck",
  "BookOpenText", "BookOpenCheck2", "BookOpenText2", "Newspaper", "Scroll",
  "ScrollText", "FileText", "FileType", "FileType2", "Type", "Text", "TextSelect",
  "AlignLeft", "AlignCenter", "AlignRight", "AlignJustify", "Bold", "Italic",
  "Underline", "Strikethrough", "Subscript", "Superscript", "List", "ListOrdered",
  "ListChecks", "ListTodo", "ListX", "ListPlus", "ListMinus", "ListStar",
  "ListHeart", "ListMusic", "ListVideo", "ListImage", "ListCode", "ListRestart",
  "ListEnd", "ListStart", "ListFilter", "ListSearch", "ListUp", "ListDown",
  "Quote", "Quote2", "Code", "Code2", "Brackets", "Braces", "Parentheses",
  "Hash", "AtSign", "Percent", "Asterisk", "Slash", "Backslash", "Plus",
  "Minus", "Equal", "GreaterThan", "LessThan", "GreaterThanOrEqual",
  "LessThanOrEqual", "NotEqual", "Divide", "X", "Check", "XCircle", "CheckCircle",
  "CheckCircle2", "XCircle2", "AlertCircle", "AlertTriangle", "Info", "HelpCircle",
  "QuestionMark", "QuestionMarkCircle", "ExclamationMark", "ExclamationMarkCircle",
  "Lightbulb", "LightbulbOff", "Zap", "ZapOff", "Bolt", "BoltOff", "Flame",
  "FlameOff", "Droplet", "DropletOff", "Snowflake", "Cloud", "CloudRain",
  "CloudSnow", "CloudLightning", "CloudDrizzle", "CloudFog", "CloudHail",
  "CloudWind", "Sun", "Sunrise", "Sunset", "Moon", "MoonStar", "MoonRising",
  "MoonSetting", "Star", "StarOff", "Sparkles", "Sparkle", "Wand", "Wand2",
  "Magic", "MagicWand", "CrystalBall", "Crystal", "Gem", "Diamond", "Diamond2",
  "Hexagon", "Pentagon", "Octagon", "Square", "Square2", "Circle", "Circle2",
  "Triangle", "Triangle2", "TriangleAlert", "TriangleAlert2", "Rectangle",
  "Rectangle2", "RectangleHorizontal", "RectangleVertical", "Ellipse",
  "Ellipse2", "Oval", "Oval2", "Rhombus", "Rhombus2", "Trapezoid", "Trapezoid2",
  "Parallelogram", "Parallelogram2", "Cross", "Cross2", "Plus", "Plus2",
  "Minus", "Minus2", "X", "X2", "Check", "Check2", "ArrowUp", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowUpLeft", "ArrowUpRight", "ArrowDownLeft",
  "ArrowDownRight", "ArrowUpDown", "ArrowLeftRight", "ArrowUpCircle",
  "ArrowDownCircle", "ArrowLeftCircle", "ArrowRightCircle", "ArrowUpSquare",
  "ArrowDownSquare", "ArrowLeftSquare", "ArrowRightSquare", "ArrowUpFromLine",
  "ArrowDownFromLine", "ArrowLeftFromLine", "ArrowRightFromLine", "ArrowUpToLine",
  "ArrowDownToLine", "ArrowLeftToLine", "ArrowRightToLine", "ArrowUpFromDot",
  "ArrowDownFromDot", "ArrowLeftFromDot", "ArrowRightFromDot", "ArrowUpToDot",
  "ArrowDownToDot", "ArrowLeftToDot", "ArrowRightToDot", "ArrowUpAZ", "ArrowDownAZ",
  "ArrowUpZA", "ArrowDownZA", "ArrowUp01", "ArrowDown01", "ArrowUp10", "ArrowDown10",
  "ArrowUpWideNarrow", "ArrowDownWideNarrow", "ArrowUpNarrowWide", "ArrowDownNarrowWide",
  "ArrowUpDown", "ArrowLeftRight", "ArrowUpLeft", "ArrowUpRight", "ArrowDownLeft",
  "ArrowDownRight", "ArrowUpCircle", "ArrowDownCircle", "ArrowLeftCircle",
  "ArrowRightCircle", "ArrowUpSquare", "ArrowDownSquare", "ArrowLeftSquare",
  "ArrowRightSquare", "ChevronUp", "ChevronDown", "ChevronLeft", "ChevronRight",
  "ChevronsUp", "ChevronsDown", "ChevronsLeft", "ChevronsRight", "ChevronUpDown",
  "ChevronLeftRight", "ChevronUpCircle", "ChevronDownCircle", "ChevronLeftCircle",
  "ChevronRightCircle", "ChevronUpSquare", "ChevronDownSquare", "ChevronLeftSquare",
  "ChevronRightSquare", "MoveUp", "MoveDown", "MoveLeft", "MoveRight", "MoveUpLeft",
  "MoveUpRight", "MoveDownLeft", "MoveDownRight", "MoveUpDown", "MoveLeftRight",
  "Move", "Move3D", "MoveDiagonal", "MoveDiagonal2", "MoveHorizontal", "MoveVertical",
  "RotateCw", "RotateCcw", "RotateCw2", "RotateCcw2", "RotateCw3", "RotateCcw3",
  "Rotate", "Rotate2", "Rotate3D", "FlipHorizontal", "FlipVertical", "FlipHorizontal2",
  "FlipVertical2", "Flip", "Flip2", "Reflect", "Reflect2", "Mirror", "Mirror2",
  "Scale", "Scale2", "Resize", "Resize2", "ResizeHorizontal", "ResizeVertical",
  "ResizeUp", "ResizeDown", "ResizeLeft", "ResizeRight", "ResizeUpLeft", "ResizeUpRight",
  "ResizeDownLeft", "ResizeDownRight", "Expand", "Expand2", "Shrink", "Shrink2",
  "Maximize", "Maximize2", "Minimize", "Minimize2", "MaximizeMinimize", "MaximizeMinimize2",
  "Fullscreen", "FullscreenExit", "Fullscreen2", "FullscreenExit2", "AspectRatio",
  "AspectRatio2", "Fit", "Fit2", "Crop", "Crop2", "CropFree", "CropFree2",
  "CropLandscape", "CropLandscape2", "CropPortrait", "CropPortrait2", "CropSquare",
  "CropSquare2", "CropRotate", "CropRotate2", "CropFlip", "CropFlip2", "CropZoom",
  "CropZoom2", "CropZoomIn", "CropZoomOut", "CropZoomIn2", "CropZoomOut2",
  "ZoomIn", "ZoomOut", "ZoomIn2", "ZoomOut2", "Zoom", "Zoom2", "ZoomReset",
  "ZoomReset2", "ZoomFit", "ZoomFit2", "ZoomToFit", "ZoomToFit2", "Focus",
  "Focus2", "FocusCenter", "FocusCenter2", "FocusLeft", "FocusLeft2", "FocusRight",
  "FocusRight2", "FocusTop", "FocusTop2", "FocusBottom", "FocusBottom2",
  "FocusCorner", "FocusCorner2", "FocusDiagonal", "FocusDiagonal2", "FocusHorizontal",
  "FocusHorizontal2", "FocusVertical", "FocusVertical2", "FocusUp", "FocusUp2",
  "FocusDown", "FocusDown2", "FocusIn", "FocusIn2", "FocusOut", "FocusOut2",
  "FocusAuto", "FocusAuto2", "FocusManual", "FocusManual2", "FocusContinuous",
  "FocusContinuous2", "FocusSingle", "FocusSingle2", "FocusMultiple", "FocusMultiple2",
  "FocusLock", "FocusLock2", "FocusUnlock", "FocusUnlock2", "FocusReset", "FocusReset2",
  "FocusZoom", "FocusZoom2", "FocusZoomIn", "FocusZoomIn2", "FocusZoomOut",
  "FocusZoomOut2", "FocusZoomReset", "FocusZoomReset2", "FocusZoomFit", "FocusZoomFit2",
  "FocusZoomToFit", "FocusZoomToFit2", "FocusCenter", "FocusCenter2", "FocusLeft",
  "FocusLeft2", "FocusRight", "FocusRight2", "FocusTop", "FocusTop2", "FocusBottom",
  "FocusBottom2", "FocusCorner", "FocusCorner2", "FocusDiagonal", "FocusDiagonal2",
  "FocusHorizontal", "FocusHorizontal2", "FocusVertical", "FocusVertical2",
  "FocusUp", "FocusUp2", "FocusDown", "FocusDown2", "FocusIn", "FocusIn2",
  "FocusOut", "FocusOut2", "FocusAuto", "FocusAuto2", "FocusManual", "FocusManual2",
  "FocusContinuous", "FocusContinuous2", "FocusSingle", "FocusSingle2", "FocusMultiple",
  "FocusMultiple2", "FocusLock", "FocusLock2", "FocusUnlock", "FocusUnlock2",
  "FocusReset", "FocusReset2", "FocusZoom", "FocusZoom2", "FocusZoomIn",
  "FocusZoomIn2", "FocusZoomOut", "FocusZoomOut2", "FocusZoomReset", "FocusZoomReset2",
  "FocusZoomFit", "FocusZoomFit2", "FocusZoomToFit", "FocusZoomToFit2"
];

// Filter to only include icons that actually exist in lucide-react
const getAvailableIcons = () => {
  return POPULAR_ICONS.filter(iconName => {
    try {
      return LucideIcons[iconName] !== undefined && typeof LucideIcons[iconName] === "function";
    } catch {
      return false;
    }
  });
};

const AVAILABLE_ICONS = getAvailableIcons();

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

