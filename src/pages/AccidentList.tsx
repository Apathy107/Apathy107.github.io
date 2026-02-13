import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { 
  Search, Filter, Plus, Calendar, MapPin, 
  Smartphone, Trash2, Edit, ChevronRight,
  MoreHorizontal, FileDiff
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 事故现场实景图数据来源
const DATA_SOURCE_OPTIONS = ['无人机拍摄', '手持设备拍摄', '行车记录仪拍摄', '其他来源'] as const;

// Mock Data
const ACCIDENTS = [
  {
    id: '20240501092',
    title: '建设北路与人民大道交叉口追尾',
    address: '建设北路 102 号路段',
    date: '2024-05-15 14:30',
    status: 'draft',
    device: 'HUA-PAD-01',
    dataSource: '无人机拍摄' as const,
    img: 'https://images.unsplash.com/photo-1599321454546-aa443831818d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '20240502115',
    title: '滨河东路非机动车与行人刮擦',
    address: '滨河东路公园南门斑马线',
    date: '2024-05-16 09:15',
    status: 'completed',
    device: 'HUA-PAD-01',
    dataSource: '手持设备拍摄' as const,
    img: 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '20240503004',
    title: '环城高速入口多车连环刮蹭',
    address: '环城高速西入口匝道200米处',
    date: '2024-05-16 18:40',
    status: 'draft',
    device: 'HUA-PAD-02',
    dataSource: '行车记录仪拍摄' as const,
    img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  }
];

const AccidentList = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <DashboardLayout title="事故管理列表">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-custom mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center sticky top-0 z-10 border border-gray-100">
        <div className="flex gap-3 w-full md:w-auto flex-1">
          <div className="relative group flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="搜索事故编号、地点..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              "px-4 py-2.5 rounded-lg border flex items-center gap-2 transition-all font-medium",
              filterOpen ? "bg-primary text-white border-primary shadow-md" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">筛选</span>
          </button>
        </div>
        
        <button 
          onClick={() => navigate('/accident/new')}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus size={20} />
          新建事故
        </button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="bg-white p-5 rounded-xl shadow-custom mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 border border-gray-100">
           <div className="space-y-1.5">
             <label className="text-xs font-bold text-gray-500 uppercase">时间范围</label>
             <input type="date" className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50" />
           </div>
           <div className="space-y-1.5">
             <label className="text-xs font-bold text-gray-500 uppercase">设备编号</label>
             <input type="text" placeholder="DEV-001" className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50" />
           </div>
           <div className="space-y-1.5">
             <label className="text-xs font-bold text-gray-500 uppercase">所属组织</label>
             <select className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50">
               <option>全部组织</option>
               <option>交警一大队</option>
               <option>交警二大队</option>
             </select>
           </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {ACCIDENTS.map((item) => (
          <div 
            key={item.id} 
            className="group bg-white rounded-xl shadow-custom hover:shadow-xl border border-transparent hover:border-primary/20 overflow-hidden transition-all duration-300 flex flex-col cursor-pointer h-full"
            onClick={() => navigate(`/accident/${item.id}`)}
          >
            {/* Image Header */}
            <div className="h-44 relative overflow-hidden bg-gray-100">
              <img src={item.img} alt="现场" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
              
              <div className="absolute top-3 right-3  z-10">
                <span className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur-md border border-white/20",
                  item.status === 'completed' 
                    ? "bg-green-500/90 text-white" 
                    : "bg-orange-500/90 text-white"
                )}>
                  {item.status === 'completed' ? '已归档' : '草稿中'}
                </span>
              </div>
              
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <div className="flex items-center text-white/90 text-xs font-mono bg-black/40 px-2 py-1 rounded inline-block backdrop-blur-sm">
                   {item.id}
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col">
              <div className="mb-3">
                 <h3 className="font-bold text-gray-800 text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                   {item.title}
                 </h3>
              </div>
              
              <div className="space-y-2.5 mt-auto">
                <div className="flex items-center gap-2.5 text-xs text-gray-500">
                  <Calendar size={14} className="text-primary/70" />
                  <span className="font-medium">{item.date}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-gray-500">
                  <MapPin size={14} className="text-primary/70 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{item.address}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-500">
                  <Smartphone size={14} className="text-primary/70" />
                  <span>{item.device}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-500">
                  <span className="text-gray-400">数据来源：</span>
                  <span className="font-medium text-gray-600">{item.dataSource}</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <button 
                  onClick={(e) => {e.stopPropagation();}} 
                  className="p-1.5 -ml-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="flex gap-2">
                  {item.status === 'draft' && (
                    <button className="flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary/5 px-2.5 py-1.5 rounded transition-colors">
                      <FileDiff size={14} /> 绘图
                    </button>
                  )}
                  <button className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:bg-gray-100 px-2.5 py-1.5 rounded transition-colors group/btn">
                    详情 <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform"/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AccidentList;