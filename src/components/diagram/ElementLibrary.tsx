import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { 
    id: 'common', 
    name: '常用图元', 
    items: ['轿车', '箭头', '碰撞点', '停车线', '血迹', '刹车痕'] 
  },
  { 
    id: 'motor', 
    name: '机动车', 
    items: ['小型轿车', 'SUV', '大货车', '公交车', '救护车', '警车', '摩托车'] 
  },
  { 
    id: 'non-motor', 
    name: '非机动车', 
    items: ['自行车', '电动车', '三轮车', '轮椅'] 
  },
  { 
    id: 'human', 
    name: '人体', 
    items: ['行人(站)', '行人(躺)', '驾驶员', '交警'] 
  },
  { 
    id: 'livestock', 
    name: '牲畜', 
    items: ['狗', '牛', '羊', '其他动物'] 
  },
  { 
    id: 'road', 
    name: '道路结构', 
    items: ['十字路口', '丁字路口', '弯道', '环岛', '车道线', '人行横道'] 
  },
  { 
    id: 'safety', 
    name: '安全设施', 
    items: ['红绿灯', '交通标志', '护栏', '隔离墩', '摄像头'] 
  },
  { 
    id: 'land', 
    name: '土地利用', 
    items: ['草地', '树木', '建筑物', '河流', '电线杆'] 
  },
  { 
    id: 'trace', 
    name: '动态痕迹', 
    items: ['刹车印', '侧滑痕', '散落物', '油迹', '划痕'] 
  },
  { 
    id: 'traffic', 
    name: '交通现象', 
    items: ['拥堵', '施工', '积水', '雾气'] 
  },
  { 
    id: 'other', 
    name: '其他图形', 
    items: ['文本框', '自定义形状', '标注线'] 
  }
];

export const ElementLibrary = () => {
  const [expanded, setExpanded] = useState<string[]>(['common', 'motor']);

  const toggleCategory = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-border w-64 flex-shrink-0">
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
           <LayoutGrid size={18} /> 图元列表
        </h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input 
            type="text" 
            placeholder="搜索图元..." 
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-100 border-none rounded-md outline-none focus:ring-1 focus:ring-primary" 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="border-b border-border/50">
            <button 
              onClick={() => toggleCategory(cat.id)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 text-left transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              {expanded.includes(cat.id) ? (
                <ChevronDown size={14} className="text-gray-400" />
              ) : (
                <ChevronRight size={14} className="text-gray-400" />
              )}
            </button>
            
            {expanded.includes(cat.id) && (
              <div className="grid grid-cols-3 gap-2 p-2 bg-gray-50/50">
                {cat.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className="aspect-square bg-white border border-border rounded flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:border-primary shadow-sm group transition-all"
                    draggable
                  >
                    <div className="w-6 h-6 bg-gray-200 rounded mb-1 group-hover:bg-blue-100 transition-colors"></div>
                    <span className="text-[10px] text-gray-500 truncate w-full text-center px-0.5 scale-90">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};