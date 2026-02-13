import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Undo, Redo, Eraser, Trash2, 
  Layers, Settings, Move, MousePointer2,
  Image as ImageIcon, MoreVertical, Plus, Minus,
  Truck, Car, PersonStanding, Type, Lock, Eye, EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DrawingEditor = () => {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState('select');
  const [activeLayer, setActiveLayer] = useState(2);
  const [scale, setScale] = useState(100);
  const [layers, setLayers] = useState([
    { id: 1, name: '底图 - 现场实景', hidden: false, locked: true },
    { id: 2, name: '道路层', hidden: false, locked: false },
    { id: 3, name: '车辆层', hidden: false, locked: false },
  ]);

  return (
    <div className="h-screen w-full bg-[#e5e9f2] flex flex-col overflow-hidden font-sans select-none">
      
      {/* 1. Editor Toolbar (Top) */}
      <header className="h-14 bg-[#0c2d48] border-b border-gray-800 flex items-center justify-between px-4 z-20 shadow-md relative text-white">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">事故绘图面板</h1>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
               <p className="text-[10px] text-gray-400">自动保存 14:32</p>
            </div>
          </div>
        </div>

        {/* Center Tools */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-[#1a3b5c] p-1 rounded-lg border border-white/5 shadow-inner">
           <ToolBtn icon={MousePointer2} active={activeTool === 'select'} onClick={() => setActiveTool('select')} label="选择工具" />
           <ToolBtn icon={Move} active={activeTool === 'move'} onClick={() => setActiveTool('move')} label="移动画布" />
           <div className="w-px h-5 bg-white/10 mx-1.5" />
           <ToolBtn icon={Type} active={activeTool === 'text'} onClick={() => setActiveTool('text')} label="文本" />
           <ToolBtn icon={Eraser} active={activeTool === 'erase'} onClick={() => setActiveTool('erase')} label="橡皮擦" />
           <div className="w-px h-5 bg-white/10 mx-1.5" />
           <ToolBtn icon={Undo} onClick={() => {}} label="撤销" />
           <ToolBtn icon={Redo} onClick={() => {}} label="重做" />
           <div className="w-px h-5 bg-white/10 mx-1.5" />
           <ToolBtn icon={Trash2} onClick={() => {}} className="text-red-400 hover:bg-red-500/20" label="删除选中" />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-medium text-gray-300 transition-colors border border-white/10">
            <Settings size={14} /> 绘图设置
          </button>
          <button className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold shadow-lg transition-colors border border-blue-400">
            <Save size={14} /> 完成并保存
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. Left Sidebar: Elements Library */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-10 shadow-sm relative">
           <div className="p-3 border-b border-gray-100 bg-gray-50">
             <div className="relative">
               <input className="w-full bg-white border border-gray-200 rounded-md px-8 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" placeholder="搜索图元 (如: 轿车)" />
               <MousePointer2 className="absolute left-2.5 top-2 text-gray-400" size={14} />
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-[#f8fafc]">
              <ElementCategory title="机动车" icon={Car} defaultOpen>
                 <ElementItem icon={Car} label="小轿车" color="text-blue-600" />
                 <ElementItem icon={Truck} label="卡车" color="text-orange-600" />
                 <ElementItem icon={Car} label="SUV" color="text-indigo-600" />
                 <ElementItem icon={Car} label="公交" color="text-green-600" />
              </ElementCategory>
              <ElementCategory title="非机动车/行人" icon={PersonStanding}>
                 <ElementItem icon={PersonStanding} label="行人" />
                 <ElementItem icon={PersonStanding} label="骑行者" />
                 <ElementItem icon={PersonStanding} label="交警" />
              </ElementCategory>
              <ElementCategory title="道路设施" icon={Layers}>
                 <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 bg-white rounded border border-gray-200 flex items-center justify-center text-[10px] text-gray-500 hover:border-primary hover:text-primary cursor-pointer shadow-sm">实线</div>
                    <div className="h-10 bg-white rounded border border-gray-200 flex items-center justify-center text-[10px] text-gray-500 hover:border-primary hover:text-primary cursor-pointer shadow-sm border-dashed">虚线</div>
                    <div className="h-10 bg-white rounded border border-gray-200 flex items-center justify-center text-[10px] text-gray-500 hover:border-primary hover:text-primary cursor-pointer shadow-sm">斑马线</div>
                    <div className="h-10 bg-white rounded border border-gray-200 flex items-center justify-center text-[10px] text-gray-500 hover:border-primary hover:text-primary cursor-pointer shadow-sm">停车线</div>
                 </div>
              </ElementCategory>
           </div>

           <div className="p-3 border-t border-gray-200 bg-white">
             <button className="w-full py-2.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border border-blue-200 hover:bg-blue-100 transition-colors shadow-sm">
               <ImageIcon size={16} /> 从图库导入实景
             </button>
           </div>
        </aside>

        {/* 3. Center: Canvas Area */}
        <div className="flex-1 bg-[#e5e9f2] relative overflow-hidden flex items-center justify-center p-8">
           {/* Canvas Controls */}
           <div className="absolute bottom-6 left-6 flex bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-20">
             <button onClick={() => setScale(s => Math.max(25, s-10))} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Minus size={16} /></button>
             <span className="px-2 py-1 text-xs font-mono flex items-center font-bold text-gray-700 w-12 justify-center">{scale}%</span>
             <button onClick={() => setScale(s => Math.min(200, s+10))} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Plus size={16} /></button>
           </div>

           {/* Canvas Area Container */}
           <div 
              className="bg-white shadow-2xl relative border border-gray-300 overflow-hidden transition-transform duration-200 ease-out"
              style={{ width: '800px', height: '520px', transform: `scale(${scale/100})` }}
           >
              {/* Background Layer */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none grayscale contrast-125"
                style={{backgroundImage: 'url(https://images.unsplash.com/photo-1616432043562-3671ea2e5242?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)'}}
              />
              
              {/* Grid overlay for precision */}
              <div className="absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(26,1fr)] pointer-events-none opacity-20">
                 {Array.from({length: 1040}).map((_, i) => (
                    <div key={i} className="border-r-[0.5px] border-b-[0.5px] border-blue-300" />
                 ))}
              </div>
              
              {/* Mock Elements */}
              {/* Car 1 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-12 -translate-y-16 w-16 h-32 border-2 border-primary bg-primary/20 flex items-center justify-center rounded-md transform -rotate-15 cursor-move group hover:bg-primary/30 z-10 transition-colors">
                 <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                   鲁B·88888 (甲)
                 </div>
                 <Car className="text-primary" size={28} />
                 {/* Selection Handles */}
                 <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-primary rounded-full" />
                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-primary rounded-full" />
                 <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-primary rounded-full" />
                 <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-primary rounded-full" />
                 {/* Rotation Handle */}
                 <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full cursor-grab" />
              </div>

               {/* Measurement Line */}
               <div className="absolute top-1/2 left-1/2 translate-x-24 translate-y-6 w-32 h-0 border-t-2 border-red-500 border-dashed flex items-center justify-center transform rotate-12">
                 <span className="bg-red-50 text-[10px] text-red-600 font-bold px-1 border border-red-100 rounded -translate-y-3 shadow-sm">12.5m</span>
                 <div className="absolute left-0 -top-1 w-0.5 h-2 bg-red-500" />
                 <div className="absolute right-0 -top-1 w-0.5 h-2 bg-red-500" />
              </div>

              {/* Road Markings */}
              <div className="absolute top-0 bottom-0 left-32 w-4 border-l-2 border-dashed border-gray-400 opacity-60"></div>
              <div className="absolute top-0 bottom-0 right-32 w-4 border-r-2 border-dashed border-gray-400 opacity-60"></div>
           </div>
        </div>

        {/* 4. Right Sidebar: Properties & Layers */}
        <aside className="w-64 bg-white border-l border-gray-200 flex flex-col z-10 shadow-sm overflow-hidden">
           
           {/* Property Panel */}
           <div className="flex-1 p-4 border-b border-gray-200 overflow-y-auto bg-gray-50/50">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">选中对象属性</h3>
              
              <div className="space-y-4">
                 <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                     <Car size={14} className="text-primary"/> 
                     <span className="text-xs font-bold text-gray-700">小型轿车-01</span>
                   </div>
                   
                   <div className="space-y-3 text-xs">
                     <div className="space-y-1">
                        <label className="text-gray-400 font-medium">标注名称</label>
                        <input className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 focus:border-primary outline-none" defaultValue="鲁B·88888 (甲)" />
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-gray-400 font-medium">X 坐标</label>
                          <input className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5" defaultValue="452.0" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-gray-400 font-medium">Y 坐标</label>
                          <input className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5" defaultValue="310.5" />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-gray-400 font-medium">旋转 (deg)</label>
                        <div className="flex items-center gap-2">
                           <input type="range" className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                           <span className="font-mono text-gray-600 bg-gray-100 px-1 rounded">-15°</span>
                        </div>
                     </div>
                   </div>
                 </div>

                 <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                   <span className="text-xs font-bold text-gray-700 block mb-2">样式设置</span>
                   <div className="grid grid-cols-4 gap-2">
                      <div className="h-6 rounded bg-red-500 cursor-pointer hover:ring-2 ring-offset-1 ring-red-300"></div>
                      <div className="h-6 rounded bg-blue-500 cursor-pointer ring-2 ring-offset-1 ring-blue-500"></div>
                      <div className="h-6 rounded bg-green-500 cursor-pointer hover:ring-2 ring-offset-1 ring-green-300"></div>
                      <div className="h-6 rounded bg-black cursor-pointer hover:ring-2 ring-offset-1 ring-gray-300"></div>
                   </div>
                 </div>
              </div>
           </div>

           {/* Layer Panel */}
           <div className="h-1/3 flex flex-col bg-white">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                 <h3 className="text-xs font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide">
                   <Layers size={14} className="text-primary"/> 图层管理
                 </h3>
                 <button className="hover:bg-gray-200 p-1 rounded text-gray-500"><Plus size={14} /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                 {layers.slice().reverse().map(layer => (
                    <div 
                      key={layer.id} 
                      onClick={() => setActiveLayer(layer.id)}
                      className={cn(
                        "flex items-center justify-between px-4 py-2.5 cursor-pointer border-b border-gray-50 text-xs transition-colors group",
                        layer.id === activeLayer ? "bg-blue-50/50" : "hover:bg-gray-50"
                      )}
                    >
                       <div className="flex items-center gap-3">
                          <button className="text-gray-400 hover:text-gray-600">
                             {layer.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <span className={cn("font-medium", layer.id === activeLayer ? "text-primary font-bold" : "text-gray-600")}>
                            {layer.name}
                          </span>
                       </div>
                       <div className="flex items-center gap-2 text-gray-400">
                          {layer.locked && <Lock size={12} />}
                          <MoreVertical size={14} className="opacity-0 group-hover:opacity-100 hover:text-gray-600" />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

const ToolBtn = ({ icon: Icon, active, onClick, className, label }: any) => (
  <button 
    onClick={onClick}
    title={label}
    className={cn(
      "p-2 rounded-md transition-all flex items-center justify-center relative group",
      active 
        ? "bg-white text-[#0c2d48] shadow-sm transform scale-110 z-10" 
        : "text-gray-400 hover:bg-white/10 hover:text-white",
      className
    )}
  >
    <Icon size={18} />
    {/* Tooltip */}
    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
      {label}
    </span>
  </button>
);

const ElementCategory = ({ title, icon: Icon, children, defaultOpen = false }: any) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">
         <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
           <Icon size={14} className="text-primary"/> {title}
         </div>
         <span className="text-gray-400">{open ? <Minus size={12}/> : <Plus size={12}/>}</span>
      </button>
      {open && (
        <div className="p-2 grid grid-cols-2 gap-2 bg-white border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

const ElementItem = ({ icon: Icon, label, color = "text-gray-500" }: any) => (
  <div className="flex flex-col items-center justify-center gap-1.5 p-3 border border-gray-100 rounded-lg hover:border-primary/50 hover:bg-blue-50/30 cursor-grab active:cursor-grabbing transition-all group hover:shadow-sm">
    <Icon size={24} className={cn("transition-colors mb-1", color)} />
    <span className="text-[10px] font-medium text-gray-500 group-hover:text-primary">{label}</span>
  </div>
);

export default DrawingEditor;