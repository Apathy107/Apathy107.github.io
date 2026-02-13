import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/layouts/DashboardLayout';
import { 
  FileText, Download, Printer, Plus, Search, Filter, 
  ClipboardCheck, Mic, Gavel, FileEdit, X, Check, Trash2, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 时间范围：今日、最近7天、最近30天的起止日期
function getTimeRange(range: string, customStart?: string, customEnd?: string): { start: Date; end: Date } | null {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const end = new Date(today);
  let start = new Date(today);
  start.setHours(0, 0, 0, 0);

  if (range === '今日') {
    return { start, end };
  }
  if (range === '最近7天') {
    start.setDate(start.getDate() - 6);
    return { start, end };
  }
  if (range === '最近30天') {
    start.setDate(start.getDate() - 29);
    return { start, end };
  }
  if (range === '自定义' && customStart && customEnd) {
    const s = new Date(customStart);
    s.setHours(0, 0, 0, 0);
    const e = new Date(customEnd);
    e.setHours(23, 59, 59, 999);
    return { start: s, end: e };
  }
  return null;
}
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Mock Accidents Field Data
const MOCK_ACCIDENTS = [
  { id: '20240501092', title: "20240501092 - 建设北路追尾", hasDrawing: true, location: "建设北路与人民大道交叉口", weather: "晴" },
  { id: '20240502115', title: "20240502115 - 滨河东路刮擦", hasDrawing: true, location: "滨河东路公园南门", weather: "多云" },
  { id: '20240503004', title: "20240503004 - 环城高速多车事故", hasDrawing: false, location: "环城高速K12+500", weather: "雨" }, // No drawing
];

// Mock Records Data（含 accidentId 便于跳转事故详情）
type RecordItem = {
  id: string;
  title: string;
  relatedCase: string;
  accidentId: string;
  date: string;
  type: string;
  status: 'finished' | 'draft';
};
const INITIAL_RECORDS: RecordItem[] = [
  { id: 'REC-20240501-01', title: "道路交通事故现场勘查笔录", relatedCase: "20240501092 - 建设北路追尾", accidentId: '20240501092', date: "2024-05-01 15:30", type: "现场勘查", status: "finished" },
  { id: 'REC-20240501-02', title: "道路交通事故认定书", relatedCase: "20240501092 - 建设北路追尾", accidentId: '20240501092', date: "2024-05-01 16:45", type: "事故认定", status: "draft" },
  { id: 'REC-20240502-01', title: "讯问笔录 - 张三", relatedCase: "20240502115 - 滨河东路刮擦", accidentId: '20240502115', date: "2024-05-02 09:30", type: "讯问笔录", status: "finished" },
  { id: 'REC-20240502-02', title: "询问笔录 - 李四", relatedCase: "20240502115 - 滨河东路刮擦", accidentId: '20240502115', date: "2024-05-02 10:15", type: "询问笔录", status: "finished" },
  { id: 'REC-20240503-01', title: "现场勘查笔录(草稿)", relatedCase: "20240503004 - 环城高速多车事故", accidentId: '20240503004', date: "2024-05-03 08:20", type: "现场勘查", status: "draft" },
  { id: 'REC-20250210-01', title: "事故认定书(草稿)", relatedCase: "20240502115 - 滨河东路刮擦", accidentId: '20240502115', date: "2025-02-10 14:00", type: "事故认定", status: "draft" },
  { id: 'REC-20250213-01', title: "今日现场勘查笔录", relatedCase: "20240501092 - 建设北路追尾", accidentId: '20240501092', date: "2025-02-13 09:00", type: "现场勘查", status: "finished" },
];

const QuickActionBtn = ({ icon: Icon, label, desc, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-start p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all group w-full text-left active:scale-95"
  >
    <div className={cn("p-3 rounded-lg mb-3 transition-colors", color)}>
      <Icon size={24} />
    </div>
    <span className="font-bold text-gray-800 group-hover:text-primary transition-colors">{label}</span>
    <span className="text-xs text-gray-400 mt-1">{desc}</span>
  </button>
);

const STATUS_OPTIONS = [{ value: '', label: '全部' }, { value: 'finished', label: '已归档' }, { value: 'draft', label: '草稿箱' }];
const TYPE_OPTIONS = [{ value: '', label: '全部' }, { value: '现场勘查', label: '现场勘查' }, { value: '事故认定', label: '事故认定' }, { value: '讯问', label: '讯问' }, { value: '询问', label: '询问' }];
const TIME_OPTIONS = [{ value: '', label: '不限' }, { value: '今日', label: '今日' }, { value: '最近7天', label: '最近7天' }, { value: '最近30天', label: '最近30天' }, { value: '自定义', label: '自定义' }];

const Records = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<RecordItem[]>(INITIAL_RECORDS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedAccidentId, setSelectedAccidentId] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [timeRangeFilter, setTimeRangeFilter] = useState('');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showAccidentDetailModal, setShowAccidentDetailModal] = useState(false);

  const timeRange = getTimeRange(timeRangeFilter, customStart, customEnd);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (statusFilter && record.status !== statusFilter) return false;
      if (typeFilter) {
        if (typeFilter === '讯问' && record.type !== '讯问笔录') return false;
        if (typeFilter === '询问' && record.type !== '询问笔录') return false;
        if (typeFilter !== '讯问' && typeFilter !== '询问' && record.type !== typeFilter) return false;
      }
      if (timeRange) {
        const recordDateStr = record.date.slice(0, 10);
        const recordDate = new Date(recordDateStr);
        if (recordDate < timeRange.start || recordDate > timeRange.end) return false;
      }
      return true;
    });
  }, [records, statusFilter, typeFilter, timeRange]);

  const handleResetFilter = () => {
    setStatusFilter('');
    setTypeFilter('');
    setTimeRangeFilter('');
    setCustomStart('');
    setCustomEnd('');
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRecords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBatchDownload = () => {
    if (selectedIds.size === 0) return;
    alert(`正在批量下载 ${selectedIds.size} 份笔录（PDF）...`);
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 份笔录吗？此操作不可恢复。`)) return;
    setRecords((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
  };

  const handleDeleteRecord = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (!confirm(`确定要删除笔录「${title}」吗？此操作不可恢复。`)) return;
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleCreateClick = (type: string) => {
    setSelectedType(type);
    setSelectedAccidentId('');
    setIsDialogOpen(true);
  };

  const handleConfirmCreate = () => {
    if (!selectedAccidentId) return;

    const accident = MOCK_ACCIDENTS.find(a => a.id === selectedAccidentId);
    
    // 校验绘图数据是否存在
    if (!accident?.hasDrawing) {
      if (confirm(`该事故【${accident?.title}】尚未完成现场绘图！\n\n根据规定，“现场勘查笔录”及相关文书必须基于现场图数据。\n\n是否立即前往绘图模块？`)) {
        navigate(`/editor/${accident?.id}`);
      }
      return;
    }

    // 校验通过，跳转至文书编辑
    setIsDialogOpen(false);
    navigate('/record-editor', { 
      state: { 
        type: selectedType, 
        accidentId: selectedAccidentId,
        mode: 'create'
      } 
    });
  };

  return (
    <Layout title="笔录文书管理">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* 1. Quick Create Section */}
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Plus size={16} /> 快速新建文书
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionBtn 
              icon={ClipboardCheck} 
              label="现场勘查笔录" 
              desc="环境、痕迹、证物标准化记录" 
              color="bg-blue-50 text-blue-600 group-hover:bg-blue-100"
              onClick={() => handleCreateClick('现场勘查')}
            />
            <QuickActionBtn 
              icon={Gavel} 
              label="事故认定书" 
              desc="责任划分、调解与认定" 
              color="bg-purple-50 text-purple-600 group-hover:bg-purple-100"
              onClick={() => handleCreateClick('事故认定')}
            />
            <QuickActionBtn 
              icon={Mic} 
              label="讯问笔录" 
              desc="针对嫌疑人的讯问记录" 
              color="bg-orange-50 text-orange-600 group-hover:bg-orange-100"
              onClick={() => handleCreateClick('讯问笔录')}
            />
            <QuickActionBtn 
              icon={FileText} 
              label="询问笔录" 
              desc="证人、受害人询问记录" 
              color="bg-green-50 text-green-600 group-hover:bg-green-100"
              onClick={() => handleCreateClick('询问笔录')}
            />
          </div>
        </section>

        {/* 2. Records List Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-[500px]">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
             <div className="flex items-center gap-2">
               <h3 className="font-bold text-lg text-gray-800">近期笔录档案</h3>
               <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-mono">{filteredRecords.length}</span>
             </div>
             
             <div className="flex w-full md:w-auto gap-3 flex-wrap">
               {selectedIds.size > 0 && (
                 <div className="flex items-center gap-2 mr-2">
                   <span className="text-sm text-gray-600">已选 {selectedIds.size} 条</span>
                   <button
                     onClick={handleBatchDownload}
                     className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                   >
                     <Download size={16} /> 批量下载
                   </button>
                   <button
                     onClick={handleBatchDelete}
                     className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-700 hover:bg-red-100"
                   >
                     <Trash2 size={16} /> 批量删除
                   </button>
                 </div>
               )}
               <div className="relative group flex-1 md:w-64 min-w-0">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                   type="text" 
                   placeholder="搜索笔录名称、案号..." 
                   className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                 />
               </div>
               <button
                 onClick={() => setFilterOpen(!filterOpen)}
                 className={cn(
                   "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                   filterOpen ? "bg-primary text-white border border-primary" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                 )}
               >
                 <Filter size={16} /> 筛选
               </button>
             </div>
          </div>

          {/* 筛选面板 */}
          {filterOpen && (
            <div className="p-4 bg-gray-50 border-b border-gray-100 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-700">组合筛选</span>
                <button onClick={handleResetFilter} className="text-xs text-gray-500 hover:text-primary flex items-center gap-1">
                  <X size={14} /> 清空
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">状态</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-md p-2.5 text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value || 'all'} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">文书类型</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-md p-2.5 text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  >
                    {TYPE_OPTIONS.map((o) => (
                      <option key={o.value || 'all'} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">时间范围</label>
                  <select
                    value={timeRangeFilter}
                    onChange={(e) => setTimeRangeFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-md p-2.5 text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  >
                    {TIME_OPTIONS.map((o) => (
                      <option key={o.value || 'none'} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                {timeRangeFilter === '自定义' && (
                  <div className="space-y-1.5 md:col-span-2 lg:col-span-1 flex flex-col md:flex-row gap-2">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-gray-500 block">开始日期</label>
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="w-full border border-gray-200 rounded-md p-2.5 text-sm bg-white"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-xs text-gray-500 block">结束日期</label>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="w-full border border-gray-200 rounded-md p-2.5 text-sm bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <Check size={14} className="text-green-600" />
                当前筛选结果：<span className="font-mono font-medium text-gray-700">{filteredRecords.length}</span> 条
              </div>
            </div>
          )}

          {/* Table List */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={filteredRecords.length > 0 && selectedIds.size === filteredRecords.length}
                      ref={(el) => { if (el) el.indeterminate = selectedIds.size > 0 && selectedIds.size < filteredRecords.length; }}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-6 py-3 w-20">状态</th>
                  <th className="px-6 py-3">文书名称</th>
                  <th className="px-6 py-3">关联事故</th>
                  <th className="px-6 py-3">文书类型</th>
                  <th className="px-6 py-3">最后修改时间</th>
                  <th className="px-6 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(record.id)}
                        onChange={() => toggleSelect(record.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {record.status === 'finished' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700 border border-green-100">
                          已归档
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-700 border border-orange-100">
                          草稿箱
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800 group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                           onClick={() => navigate('/record-editor', { state: { type: record.type.replace('笔录', ''), mode: 'edit', id: record.id, accidentId: record.accidentId } })}
                      >
                         <FileText size={16} className="text-gray-400 group-hover:text-primary" />
                         {record.title}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5 font-mono">{record.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/accident/${record.accidentId}`); }}
                        className="text-primary hover:underline text-left font-medium"
                      >
                        {record.relatedCase}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs",
                        record.type.includes("勘查") ? "bg-blue-50 text-blue-700" :
                        record.type.includes("讯问") ? "bg-orange-50 text-orange-700" :
                        record.type.includes("询问") ? "bg-green-50 text-green-700" :
                        "bg-gray-100 text-gray-600"
                      )}>{record.type}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono">{record.date}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => navigate('/record-editor', { state: { type: record.type.replace('笔录', ''), mode: 'edit', id: record.id, accidentId: record.accidentId } })}
                           className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded text-blue-600" title="编辑"
                         >
                           <FileEdit size={16} />
                         </button>
                         <button className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded text-gray-600" title="打印">
                           <Printer size={16} />
                         </button>
                         <button className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded text-gray-600" title="下载PDF">
                           <Download size={16} />
                         </button>
                         <button
                           onClick={(e) => handleDeleteRecord(e, record.id, record.title)}
                           className="p-1.5 hover:bg-red-50 hover:shadow-sm border border-transparent hover:border-red-200 rounded text-gray-500 hover:text-red-600"
                           title="删除"
                         >
                           <Trash2 size={16} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
             <span>显示 1-{filteredRecords.length} 共 {filteredRecords.length} 条记录</span>
             <div className="flex gap-1">
               <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>上一页</button>
               <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>下一页</button>
             </div>
          </div>
        </section>
      </div>

      {/* 事故详情浮窗（新建笔录时） */}
      <Dialog open={showAccidentDetailModal} onOpenChange={setShowAccidentDetailModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>事故详情</DialogTitle>
            <DialogDescription>当前选择事故的基础信息，仅供参考。</DialogDescription>
          </DialogHeader>
          {selectedAccidentId && (() => {
            const acc = MOCK_ACCIDENTS.find((a) => a.id === selectedAccidentId);
            if (!acc) return null;
            return (
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                  <span className="text-gray-500">案件编号</span>
                  <span className="font-mono font-medium">{acc.id}</span>
                  <span className="text-gray-500">案件名称</span>
                  <span>{acc.title}</span>
                  <span className="text-gray-500">事故地点</span>
                  <span>{acc.location}</span>
                  <span className="text-gray-500">天气</span>
                  <span>{acc.weather}</span>
                  <span className="text-gray-500">现场图</span>
                  <span>
                    {acc.hasDrawing ? (
                      <span className="text-green-600 font-medium">已绘制</span>
                    ) : (
                      <span className="text-red-600 font-medium">未绘制</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <Button variant="outline" size="sm" onClick={() => setShowAccidentDetailModal(false)}>
                    关闭
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setShowAccidentDetailModal(false);
                      navigate(`/accident/${acc.id}`);
                    }}
                  >
                    前往事故详情页
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Create Record Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setShowAccidentDetailModal(false); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新建{selectedType}</DialogTitle>
            <DialogDescription>
              请选择关联的交通事故。系统将自动拉取事故绘图数据及基础信息。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>关联事故</Label>
                {selectedAccidentId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-primary gap-1.5"
                    onClick={() => setShowAccidentDetailModal(true)}
                  >
                    <Info size={16} /> 事故详情
                  </Button>
                )}
              </div>
              <Select onValueChange={setSelectedAccidentId} value={selectedAccidentId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择事故案件..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_ACCIDENTS.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      <span className="flex items-center justify-between w-full gap-2">
                        <span>{acc.title}</span>
                        {!acc.hasDrawing && (
                          <span className="text-[10px] text-red-500 bg-red-50 px-1 rounded">无绘图</span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
            <Button onClick={handleConfirmCreate} disabled={!selectedAccidentId}>
              开始录入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Records;