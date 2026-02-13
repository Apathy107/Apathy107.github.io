import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown,
  FileText, MapPin, Download, Image as ImageIcon, BarChart3, Save, Printer, Plus, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const REPORT_STORAGE_KEY = 'stats_report';
type ReportCase = { id: number; accidentId?: string; title: string; date: string; summary: string; thumb: string };

// 事故列表（与事故管理一致，用于周/月报选择典型案例）
const ACCIDENTS_FOR_SELECTION = [
  { id: '20240501092', title: '建设北路与人民大道交叉口追尾', address: '建设北路 102 号路段', date: '2024-05-15 14:30', img: 'https://images.unsplash.com/photo-1599321454546-aa443831818d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
  { id: '20240502115', title: '滨河东路非机动车与行人刮擦', address: '滨河东路公园南门斑马线', date: '2024-05-16 09:15', img: 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
  { id: '20240503004', title: '环城高速入口多车连环刮蹭', address: '环城高速西入口匝道200米处', date: '2024-05-16 18:40', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
];

// ========== 功能点1：数据概览 - Mock ==========
const OVERVIEW = {
  total: 1247,
  totalYoY: 5.2,   // 同比 %
  totalMoM: -3.1,  // 环比 %
  typeBreakdown: [
    { name: '机动车事故', value: 612 },
    { name: '非机动车事故', value: 398 },
    { name: '人车事故', value: 237 },
  ],
  statusCounts: [
//    { label: '待处理', value: 28, color: 'text-orange-600 bg-orange-50' },
    { label: '处理中', value: 45, color: 'text-blue-600 bg-blue-50' },
    { label: '已结案', value: 1174, color: 'text-green-600 bg-green-50' },
  ],
};

// ========== 事故形态趋势 - Mock ==========
const TREND_DAILY = [
  { date: '02-07', 变道事故: 4, 闯红灯事故: 2, 追尾: 6, 其他: 3 },
  { date: '02-08', 变道事故: 5, 闯红灯事故: 3, 追尾: 5, 其他: 2 },
  { date: '02-09', 变道事故: 3, 闯红灯事故: 4, 追尾: 7, 其他: 4 },
  { date: '02-10', 变道事故: 6, 闯红灯事故: 2, 追尾: 4, 其他: 3 },
  { date: '02-11', 变道事故: 4, 闯红灯事故: 5, 追尾: 8, 其他: 2 },
  { date: '02-12', 变道事故: 5, 闯红灯事故: 3, 追尾: 6, 其他: 5 },
  { date: '02-13', 变道事故: 7, 闯红灯事故: 4, 追尾: 5, 其他: 3 },
];
const TREND_LINE_KEYS = ['变道事故', '闯红灯事故', '追尾', '其他'] as const;
const TREND_COLORS: Record<string, string> = {
  '变道事故': '#0f3c78',
  '闯红灯事故': '#dc2626',
  '追尾': '#059669',
  '其他': '#6b7280',
};

// ========== 功能点4：周/月报 - Mock ==========
const TOP3_INTERSECTIONS = [
  { rank: 1, name: '建设北路与人民大道交叉口', count: 42, trend: 'up' },
  { rank: 2, name: '滨河东路公园南门斑马线', count: 38, trend: 'down' },
  { rank: 3, name: '环城高速西入口匝道', count: 31, trend: 'up' },
];
const TYPICAL_CASES = [
  { id: 1, title: '建设北路追尾事故', date: '2025-02-10', summary: '两车追尾，无人伤亡，责任明确。', thumb: 'https://images.unsplash.com/photo-1599321454546-aa443831818d?w=120&h=80&fit=crop' },
  { id: 2, title: '滨河东路非机动车刮擦', date: '2025-02-11', summary: '电动自行车与行人刮擦，轻伤。', thumb: 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?w=120&h=80&fit=crop' },
];
const SUGGESTIONS = [
  '建议在建设北路与人民大道交叉口增设左转专用信号灯，减少变道冲突。',
  '滨河东路公园南门斑马线处建议加装违法抓拍设备，降低闯红灯率。',
  '环城高速西入口匝道处加强限速与提示标志，避免匝道汇流事故。',
];

const TYPE_COLORS = ['#0f3c78', '#3b82f6', '#10b981'];

// 时间段选项（数据概览含「全时长」）
const OVERVIEW_TIME_OPTIONS = [
  { id: 'all', name: '全时长' },
  { id: '24h', name: '24h内' },
  { id: '7d', name: '7天内' },
  { id: '30d', name: '30天内' },
  { id: 'custom', name: '自定义' },
];
const RANGE_TIME_OPTIONS = [
  { id: '24h', name: '24h内' },
  { id: '7d', name: '7天内' },
  { id: '30d', name: '30天内' },
  { id: 'custom', name: '自定义' },
];

function formatTimeRangeLabel(
  rangeId: string,
  customStart?: string,
  customEnd?: string
): string {
  if (rangeId === 'all') return '全时长';
  if (rangeId === '24h') return '24小时内';
  if (rangeId === '7d') return '近7天';
  if (rangeId === '30d') return '近30天';
  if (rangeId === 'custom' && customStart && customEnd) return `${customStart} 至 ${customEnd}`;
  return '自定义';
}

const Statistics = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'trend' | 'report'>('overview');
  const [overviewTimeRange, setOverviewTimeRange] = useState('all');
  const [overviewCustomStart, setOverviewCustomStart] = useState('');
  const [overviewCustomEnd, setOverviewCustomEnd] = useState('');
  const [trendTimeRange, setTrendTimeRange] = useState('7d');
  const [trendCustomStart, setTrendCustomStart] = useState('');
  const [trendCustomEnd, setTrendCustomEnd] = useState('');
  const [reportTimeRange, setReportTimeRange] = useState('7d');
  const [reportCustomStart, setReportCustomStart] = useState('');
  const [reportCustomEnd, setReportCustomEnd] = useState('');
  const [trendChecked, setTrendChecked] = useState<Record<string, boolean>>({
    '变道事故': true,
    '闯红灯事故': true,
    '追尾': false,
    '其他': false,
  });
  const [reportType, setReportType] = useState<'week' | 'month'>('week');
  const [reportGenerated, setReportGenerated] = useState(false);

  // 周报/月报切换时重置时间段默认值
  React.useEffect(() => {
    setReportTimeRange(reportType === 'week' ? '7d' : '30d');
    setReportCustomStart('');
    setReportCustomEnd('');
  }, [reportType]);
  const [reportCases, setReportCases] = useState<ReportCase[]>(TYPICAL_CASES.map((c, i) => ({ ...c, id: i + 1 })));
  const [reportSuggestions, setReportSuggestions] = useState<string[]>([]);
  const reportContentRef = React.useRef<HTMLDivElement>(null);

  // 可选事故（未已加入典型案例的）
  const availableAccidents = useMemo(() => {
    const addedIds = new Set(reportCases.map((c) => (c as ReportCase & { accidentId?: string }).accidentId).filter(Boolean));
    return ACCIDENTS_FOR_SELECTION.filter((a) => !addedIds.has(a.id));
  }, [reportCases]);

  // 趋势图展示的线条
  const trendLines = useMemo(() => {
    return TREND_LINE_KEYS.filter((key) => trendChecked[key]);
  }, [trendChecked]);

  const toggleTrendLine = (key: string) => {
    setTrendChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const storageKey = `${REPORT_STORAGE_KEY}_${reportType}`;

  const loadSavedReport = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw) as { cases: ReportCase[]; suggestions: string[] };
        if (data.cases?.length) setReportCases(data.cases);
        if (data.suggestions?.length) setReportSuggestions(data.suggestions);
      } else {
        setReportCases(TYPICAL_CASES.map((c, i) => ({ ...c, id: i + 1 })));
        setReportSuggestions([...SUGGESTIONS]);
      }
    } catch {
      setReportCases(TYPICAL_CASES.map((c, i) => ({ ...c, id: i + 1 })));
      setReportSuggestions([...SUGGESTIONS]);
    }
  };

  const handleGenerateReport = () => {
    loadSavedReport();
    setReportGenerated(true);
  };

  const handleSaveReport = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ cases: reportCases, suggestions: reportSuggestions }));
      alert('报告内容已保存。');
    } catch (e) {
      alert('保存失败，请重试。');
    }
  };

  const handleExportReport = () => {
    if (!reportContentRef.current) return;
    const prevTitle = document.title;
    document.title = `${reportType === 'week' ? '周' : '月'}度事故分析报告`;
    const printContent = reportContentRef.current.innerHTML;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <!DOCTYPE html><html><head><title>${document.title}</title>
        <style>body{font-family:system-ui,sans-serif;padding:24px;max-width:800px;margin:0 auto;} img{max-width:120px;height:auto;}</style>
        </head><body>${printContent}</body></html>
      `);
      win.document.close();
      win.print();
      win.close();
    }
    document.title = prevTitle;
  };

  const addCaseFromAccident = (accidentId: string) => {
    const acc = ACCIDENTS_FOR_SELECTION.find((a) => a.id === accidentId);
    if (!acc) return;
    setReportCases((prev) => [
      ...prev,
      {
        id: Date.now(),
        accidentId: acc.id,
        title: acc.title,
        date: acc.date,
        summary: acc.address || '',
        thumb: acc.img,
      },
    ]);
  };
  const updateCase = (id: number, field: keyof ReportCase, value: string) => {
    setReportCases((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };
  const removeCase = (id: number) => {
    setReportCases((prev) => prev.filter((c) => c.id !== id));
  };
  const addSuggestion = () => setReportSuggestions((prev) => [...prev, '']);
  const updateSuggestion = (index: number, value: string) => {
    setReportSuggestions((prev) => prev.map((s, i) => (i === index ? value : s)));
  };
  const removeSuggestion = (index: number) => {
    setReportSuggestions((prev) => prev.filter((_, i) => i !== index));
  };

  const sections = [
    { id: 'overview' as const, label: '数据概览', icon: BarChart3 },
    { id: 'trend' as const, label: '形态趋势', icon: TrendingUp },
    { id: 'report' as const, label: '周/月报', icon: FileText },
  ];

  return (
    <DashboardLayout title="事故统计">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* 顶部 Tab */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                activeSection === s.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              <s.icon size={18} />
              {s.label}
            </button>
          ))}
        </div>

        {/* ========== 数据概览仪表盘 ========== */}
        {activeSection === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-lg font-bold text-gray-800">数据概览</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">时间段：</span>
                <select
                  value={overviewTimeRange}
                  onChange={(e) => setOverviewTimeRange(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {OVERVIEW_TIME_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
                {overviewTimeRange === 'custom' && (
                  <>
                    <input
                      type="date"
                      value={overviewCustomStart}
                      onChange={(e) => setOverviewCustomStart(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                    <span className="text-gray-400">至</span>
                    <input
                      type="date"
                      value={overviewCustomEnd}
                      onChange={(e) => setOverviewCustomEnd(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </>
                )}
                <span className="text-xs text-gray-400">
                  当前统计：{formatTimeRangeLabel(overviewTimeRange, overviewCustomStart, overviewCustomEnd)}
                </span>
              </div>
            </div>
            {/* 总量统计 + 同比环比 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-custom p-6">
                <p className="text-sm font-medium text-gray-500">累计事故数</p>
                <p className="text-3xl font-bold text-primary mt-2">{OVERVIEW.total}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1 text-green-600">
                    <TrendingUp size={16} /> 同比 {OVERVIEW.totalYoY}%
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <TrendingDown size={16} /> 环比 {OVERVIEW.totalMoM}%
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-custom p-6 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500 mb-2">类型占比</p>
                  <div className="flex items-center gap-4">
                    {OVERVIEW.typeBreakdown.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: TYPE_COLORS[i] }}
                        />
                        <span className="text-xs text-gray-600">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-custom p-6">
                <p className="text-sm font-medium text-gray-500 mb-3">处理状态</p>
                <div className="flex flex-wrap gap-3">
                  {OVERVIEW.statusCounts.map((s) => (
                    <div
                      key={s.label}
                      className={cn('px-4 py-2 rounded-lg font-medium', s.color)}
                    >
                      {s.label}：{s.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* 类型占比 - 环形图 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-custom p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">事故类型占比</h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-64 w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={OVERVIEW.typeBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                      >
                        {OVERVIEW.typeBreakdown.map((_, i) => (
                          <Cell key={i} fill={TYPE_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`${v} 起`, '数量']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {OVERVIEW.typeBreakdown.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: TYPE_COLORS[i] }}
                        />
                        {item.name}
                      </span>
                      <span className="font-mono text-sm text-gray-600">
                        {((item.value / OVERVIEW.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== 事故形态趋势图 ========== */}
        {activeSection === 'trend' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-lg font-bold text-gray-800">事故形态趋势</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">时间段：</span>
                <select
                  value={trendTimeRange}
                  onChange={(e) => setTrendTimeRange(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {RANGE_TIME_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
                {trendTimeRange === 'custom' && (
                  <>
                    <input
                      type="date"
                      value={trendCustomStart}
                      onChange={(e) => setTrendCustomStart(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                    <span className="text-gray-400">至</span>
                    <input
                      type="date"
                      value={trendCustomEnd}
                      onChange={(e) => setTrendCustomEnd(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </>
                )}
                <span className="text-xs text-gray-400">
                  当前统计：{formatTimeRangeLabel(trendTimeRange, trendCustomStart, trendCustomEnd)}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-custom p-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-600">对比形态：</span>
                {TREND_LINE_KEYS.map((key) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!trendChecked[key]}
                      onChange={() => toggleTrendLine(key)}
                      className="rounded border-gray-300"
                    />
                    <span
                      className="text-sm"
                      style={{ color: TREND_COLORS[key] }}
                                    >
                      {key}
                    </span>
                  </label>
                ))}
              </div>
              <div className="h-80">
                {trendLines.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={TREND_DAILY}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      {trendLines.map((key) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={TREND_COLORS[key]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    请至少勾选一种事故形态
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">X 轴：时间（日） · Y 轴：事故数量</p>
            </div>
          </div>
        )}

        {/* ========== 一键生成周/月报 ========== */}
        {activeSection === 'report' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-800">一键生成周/月报</h2>
            <div className="bg-white rounded-xl border border-gray-100 shadow-custom p-6">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setReportType('week')}
                    className={cn(
                      'px-4 py-2 text-sm font-medium',
                      reportType === 'week' ? 'bg-primary text-white' : 'bg-white text-gray-600'
                    )}
                  >
                    周报
                  </button>
                  <button
                    onClick={() => setReportType('month')}
                    className={cn(
                      'px-4 py-2 text-sm font-medium',
                      reportType === 'month' ? 'bg-primary text-white' : 'bg-white text-gray-600'
                    )}
                  >
                    月报
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">时间段：</span>
                  <select
                    value={reportTimeRange}
                    onChange={(e) => setReportTimeRange(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    {RANGE_TIME_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                  {reportTimeRange === 'custom' && (
                    <>
                      <input
                        type="date"
                        value={reportCustomStart}
                        onChange={(e) => setReportCustomStart(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      />
                      <span className="text-gray-400">至</span>
                      <input
                        type="date"
                        value={reportCustomEnd}
                        onChange={(e) => setReportCustomEnd(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      />
                    </>
                  )}
                  <span className="text-xs text-gray-400">
                    统计范围：{formatTimeRangeLabel(reportTimeRange, reportCustomStart, reportCustomEnd)}
                  </span>
                </div>
                <button
                  onClick={handleGenerateReport}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                >
                  <Download size={18} />
                  生成{reportType === 'week' ? '周' : '月'}报
                </button>
                {reportGenerated && (
                  <>
                    <button
                      onClick={handleSaveReport}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Save size={18} />
                      保存
                    </button>
                    <button
                      onClick={handleExportReport}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Printer size={18} />
                      导出
                    </button>
                  </>
                )}
              </div>

              {reportGenerated && (
                <div ref={reportContentRef} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800">
                      {reportType === 'week' ? '周' : '月'}度事故分析报告
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      生成时间：{new Date().toLocaleString('zh-CN')}
                      {' · '}统计范围：{formatTimeRangeLabel(reportTimeRange, reportCustomStart, reportCustomEnd)}
                    </p>
                  </div>
                  <div className="p-6 space-y-6 text-sm">
                    <section>
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <BarChart3 size={18} /> 辖区事故总览
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        本{reportType === 'week' ? '周' : '月'}累计事故 {OVERVIEW.total} 起，同比{OVERVIEW.totalYoY > 0 ? '上升' : '下降'} {Math.abs(OVERVIEW.totalYoY)}%。
                        其中机动车事故占比 {((OVERVIEW.typeBreakdown[0].value / OVERVIEW.total) * 100).toFixed(1)}%，
                        非机动车事故 {((OVERVIEW.typeBreakdown[1].value / OVERVIEW.total) * 100).toFixed(1)}%，
                        人车事故 {((OVERVIEW.typeBreakdown[2].value / OVERVIEW.total) * 100).toFixed(1)}%。
                        待处理 {OVERVIEW.statusCounts[0].value} 起，处理中 {OVERVIEW.statusCounts[1].value} 起，已结案 {OVERVIEW.statusCounts[2].value} 起。
                      </p>
                    </section>
                    <section>
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <MapPin size={18} /> TOP3 高发路口
                      </h4>
                      <ul className="space-y-2">
                        {TOP3_INTERSECTIONS.map((item) => (
                          <li key={item.rank} className="flex items-center gap-3 text-gray-700">
                            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                              {item.rank}
                            </span>
                            <span>{item.name}</span>
                            <span className="font-mono text-primary">{item.count} 起</span>
                            {item.trend === 'up' ? (
                              <TrendingUp size={14} className="text-red-500" />
                            ) : (
                              <TrendingDown size={14} className="text-green-500" />
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                    {/* 典型案例：可编辑 */}
                    <section>
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <ImageIcon size={18} /> 典型案例
                      </h4>
                      <div className="space-y-3">
                        {reportCases.map((c) => (
                          <div key={c.id} className="border border-gray-200 rounded-lg p-3 flex gap-3">
                            <div className="shrink-0">
                              <img
                                src={c.thumb || 'https://via.placeholder.com/120x80?text=缩略图'}
                                alt={c.title}
                                className="w-28 h-20 object-cover rounded border border-gray-200"
                              />
                              <input
                                type="text"
                                placeholder="图片URL"
                                value={c.thumb}
                                onChange={(e) => updateCase(c.id, 'thumb', e.target.value)}
                                className="mt-1 w-28 text-[10px] border border-gray-200 rounded px-1 py-0.5"
                              />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <input
                                type="text"
                                placeholder="案例标题"
                                value={c.title}
                                onChange={(e) => updateCase(c.id, 'title', e.target.value)}
                                className="w-full border border-gray-200 rounded px-2 py-1 text-sm font-medium"
                              />
                              <input
                                type="text"
                                placeholder="日期"
                                value={c.date}
                                onChange={(e) => updateCase(c.id, 'date', e.target.value)}
                                className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
                              />
                              <textarea
                                placeholder="案例简述"
                                value={c.summary}
                                onChange={(e) => updateCase(c.id, 'summary', e.target.value)}
                                className="w-full border border-gray-200 rounded px-2 py-1 text-xs resize-none h-12"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCase(c.id)}
                              className="shrink-0 p-1.5 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 shrink-0">从事故列表选择：</label>
                          <select
                            value=""
                            onChange={(e) => {
                              const v = e.target.value;
                              if (v) {
                                addCaseFromAccident(v);
                                e.target.value = '';
                              }
                            }}
                            className="flex-1 max-w-md border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                          >
                            <option value="">请选择要添加的事故...</option>
                            {availableAccidents.map((acc) => (
                              <option key={acc.id} value={acc.id}>
                                {acc.id} · {acc.title}
                              </option>
                            ))}
                            {availableAccidents.length === 0 && (
                              <option value="" disabled>暂无未添加的事故</option>
                            )}
                          </select>
                        </div>
                      </div>
                    </section>
                    {/* 整改建议：可编辑 */}
                    <section>
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <FileText size={18} /> 整改建议
                      </h4>
                      <div className="space-y-2">
                        {reportSuggestions.map((s, i) => (
                          <div key={i} className="flex gap-2">
                            <span className="text-gray-400 shrink-0">{i + 1}.</span>
                            <input
                              type="text"
                              value={s}
                              onChange={(e) => updateSuggestion(i, e.target.value)}
                              placeholder="输入整改建议"
                              className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeSuggestion(i)}
                              className="shrink-0 p-2 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addSuggestion}
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <Plus size={14} /> 添加整改建议
                        </button>
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {!reportGenerated && (
                <p className="text-gray-500 text-sm">点击「生成周报」或「生成月报」后，将在此展示图文分析报告。</p>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
