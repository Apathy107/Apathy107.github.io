import { useState } from 'react';
import { 
  Layers, Settings2, Eye, EyeOff, Lock, Unlock, Trash2, 
  MoveUp, MoveDown, ChevronsUp, ChevronsDown, Type, Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const RightPanel = () => {
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');
  
  // Mock Layers Data
  const [layers, setLayers] = useState([
    { id: 1, name: '轿车 (京A·XX234)', visible: true, locked: false, type: 'vehicle' },
    { id: 2, name: '轿车 (沪C·YY567)', visible: true, locked: true, type: 'vehicle' },
    { id: 3, name: '刹车痕 A', visible: true, locked: false, type: 'trace' },
    { id: 4, name: '道路基准线', visible: true, locked: true, type: 'measure' },
    { id: 5, name: '实景底图', visible: true, locked: true, type: 'bg' },
  ]);

  return (
    <div className="w-72 bg-white border-l border-border flex flex-col h-full flex-shrink-0">
      {/* Tab Header */}
      <div className="flex border-b border-border">
        <button 
          onClick={() => setActiveTab('properties')}
          className={cn(
            "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors",
            activeTab === 'properties' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          <Settings2 size={16} /> 样式调整
        </button>
        <button 
          onClick={() => setActiveTab('layers')}
          className={cn(
            "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors",
            activeTab === 'layers' ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          <Layers size={16} /> 图层控制
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'properties' ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">选中的图元</h4>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="font-medium text-sm text-gray-800">小型轿车</div>
                <div className="text-xs text-blue-600 mt-1">ID: #Obj-2024001</div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Type size={14} /> 文字描述
              </label>
              <input 
                type="text" 
                defaultValue="京A·XX234"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-border rounded-md focus:ring-1 focus:ring-primary outline-none" 
              />
              <div className="flex gap-2">
                 <input type="color" className="h-8 w-12 cursor-pointer border border-border rounded" defaultValue="#000000" />
                 <select className="flex-1 text-sm bg-gray-50 border border-border rounded px-2 outline-none">
                   <option>12px</option>
                   <option>14px</option>
                   <option>16px</option>
                 </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Palette size={14} /> 样式设置
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">透明度</span>
                  <input type="range" className="w-full accent-primary h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">旋转角度</span>
                  <input type="number" defaultValue="45" className="w-full px-2 py-1 text-xs border border-border rounded" />
                </div>
              </div>
              
              <button className="w-full py-2 text-xs font-medium border border-dashed border-gray-300 rounded text-gray-600 hover:border-primary hover:text-primary transition-colors">
                替换图元
              </button>
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
              <h4 className="text-xs font-medium text-gray-500 mb-2">层级调整</h4>
              <div className="grid grid-cols-4 gap-2">
                <button className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded hover:bg-gray-100" title="置于顶层">
                  <ChevronsUp size={16} className="text-gray-700" />
                  <span className="text-[10px] text-gray-500 mt-1">顶层</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded hover:bg-gray-100" title="上移一层">
                  <MoveUp size={16} className="text-gray-700" />
                  <span className="text-[10px] text-gray-500 mt-1">上移</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded hover:bg-gray-100" title="下移一层">
                  <MoveDown size={16} className="text-gray-700" />
                  <span className="text-[10px] text-gray-500 mt-1">下移</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded hover:bg-gray-100" title="置于底层">
                  <ChevronsDown size={16} className="text-gray-700" />
                  <span className="text-[10px] text-gray-500 mt-1">底层</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
             {layers.map((layer) => (
               <div key={layer.id} className={cn(
                 "flex items-center justify-between p-2 rounded-md border border-transparent group",
                 layer.visible ? "bg-white hover:bg-gray-50" : "bg-gray-50 opacity-60",
                 layer.locked && "bg-gray-50"
               )}>
                 <div className="flex items-center gap-2 overflow-hidden">
                   <div className={cn(
                     "w-1 h-8 rounded-full flex-shrink-0", 
                     layer.type === 'vehicle' ? 'bg-primary' : layer.type === 'trace' ? 'bg-orange-400' : 'bg-gray-300'
                   )} />
                   <span className="text-sm text-gray-700 truncate">{layer.name}</span>
                 </div>
                 
                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => {}} className="p-1 hover:bg-gray-200 rounded text-gray-500">
                      {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
                    </button>
                    <button onClick={() => {}} className="p-1 hover:bg-gray-200 rounded text-gray-500">
                      {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    {!layer.locked && (
                      <button className="p-1 hover:bg-red-100 hover:text-red-500 rounded text-gray-500">
                        <Trash2 size={12} />
                      </button>
                    )}
                 </div>
               </div>
             ))}

             <div className="pt-4 mt-4 border-t border-border">
               <button className="w-full py-2 text-sm text-primary border border-dashed border-primary/30 rounded-md hover:bg-primary/5">
                 + 新建分组
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};