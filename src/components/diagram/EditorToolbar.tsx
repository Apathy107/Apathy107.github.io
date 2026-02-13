import { 
  Undo, Redo, MousePointer2, Eraser, Trash2, Save, Smartphone, 
  Maximize, Download, History, Settings, BookOpen, Image as ImageIcon,
  Wand2, Ruler, MapPin, Compass, Eye, PenTool, Scaling, ArrowLeftRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface EditorToolbarProps {
  onToolChange: (tool: string) => void;
  activeTool: string;
  onAction: (action: string) => void;
  showRealImage: boolean;
}

export const EditorToolbar = ({ onToolChange, activeTool, onAction, showRealImage }: EditorToolbarProps) => {
  const [orientation, setOrientation] = useState<'h' | 'v'>('h');

  return (
    <div className="flex flex-col border-b border-border bg-white z-20 shadow-sm">
      {/* Top Row: Main Tools */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-border/50">
        <div className="flex items-center gap-1">
          <button onClick={() => onAction('undo')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="撤销"><Undo size={18} /></button>
          <button onClick={() => onAction('redo')} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="重做"><Redo size={18} /></button>
          <div className="w-px h-6 bg-border mx-2" />
          
          <ToolButton 
            active={activeTool === 'select'} 
            onClick={() => onToolChange('select')} 
            icon={MousePointer2} 
            label="选择" 
          />
          <ToolButton 
            active={activeTool === 'eraser'} 
            onClick={() => onToolChange('eraser')} 
            icon={Eraser} 
            label="橡皮擦" 
          />
          <button onClick={() => onAction('clear')} className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded text-gray-600 ml-1" title="一键清空"><Trash2 size={18} /></button>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={() => setOrientation(o => o === 'h' ? 'v' : 'h')}
             className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700"
           >
             <Smartphone size={14} className={cn(orientation === 'h' ? 'rotate-90' : '')} />
             {orientation === 'h' ? '横版' : '竖版'}
           </button>
           <div className="w-px h-6 bg-border mx-1" />
           <ActionButton onClick={() => onAction('preview')} icon={Maximize} tooltip="全屏" />
           <ActionButton onClick={() => onAction('export')} icon={Download} tooltip="导出" />
           <ActionButton onClick={() => onAction('history')} icon={History} tooltip="版本切换" />
           <ActionButton onClick={() => onAction('settings')} icon={Settings} tooltip="设置" />
           <ActionButton onClick={() => onAction('help')} icon={BookOpen} tooltip="教程" />
           <button 
             onClick={() => onAction('save')}
             className="ml-2 flex items-center gap-1 px-4 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 shadow-sm"
           >
             <Save size={14} /> 保存
           </button>
        </div>
      </div>

      {/* Bottom Row: Quick Draw & Toggles */}
      <div className="flex items-center px-4 h-10 bg-gray-50/50 gap-4 overflow-x-auto scrollbar-hide">
        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer hover:text-primary select-none border-r border-border pr-4">
          <input type="checkbox" checked={showRealImage} onChange={() => onAction('toggleImage')} className="rounded border-gray-300 text-primary focus:ring-primary" />
          <ImageIcon size={14} /> Only实景图
        </label>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">快捷绘制:</span>
          
          <QuickTool onClick={() => onAction('recognize')} icon={Wand2} label="事故要素/一键识别" highlight />
          <QuickTool onClick={() => onToolChange('baseline')} icon={ArrowLeftRight} label="基准线" />
          <QuickTool onClick={() => onToolChange('point')} icon={MapPin} label="基准点" />
          <QuickTool onClick={() => onToolChange('ruler')} icon={Ruler} label="标尺" />
          <QuickTool onClick={() => onToolChange('compass')} icon={Compass} label="指北针" />
        </div>
        
        <div className="flex-1" />
        
        <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
          <Eye size={14} /> 显示设置
        </button>
      </div>
    </div>
  );
};

const ToolButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "p-1.5 rounded flex items-center gap-1 transition-colors mx-0.5",
      active ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"
    )}
    title={label}
  >
    <Icon size={18} />
  </button>
);

const ActionButton = ({ onClick, icon: Icon, tooltip }: any) => (
  <button onClick={onClick} className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded" title={tooltip}>
    <Icon size={16} />
  </button>
);

const QuickTool = ({ onClick, icon: Icon, label, highlight }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors border",
      highlight 
        ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" 
        : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:text-primary"
    )}
  >
    <Icon size={13} />
    {label}
  </button>
);