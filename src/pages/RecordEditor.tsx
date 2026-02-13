import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/layouts/DashboardLayout';
import { 
  ArrowLeft, Save, Printer, FileCheck, 
  Lock, Plus, Trash2, FilePlus, ChevronDown, Download, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SignatureModal } from '@/components/diagram/SignatureModal';

// Mock Accidents for Auto-fill simulation
const MOCK_ACCIDENT_DETAILS = {
  '20240501092': {
    location: '北京市朝阳区建设北路与人民大道交叉口',
    date: '2024-05-01',
    time: '14:20',
    weather: '晴',
    roadType: '一级',
    surface: '沥青',
    parties: [
      { name: '张三', phone: '13800138000', idCard: '110101199001011234', plate: '京A·12345', type: '小型轿车' },
      { name: '李四', phone: '13900139000', idCard: '110102199202025678', plate: '京N·88888', type: '电动自行车' }
    ]
  }
};

const RecordEditor = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state as { type?: string; accidentId?: string; mode?: string } || {};
  const [showSignature, setShowSignature] = useState(false);
  const [recordType, setRecordType] = useState(locationState.type || '现场勘察');
  const [isLocked, setIsLocked] = useState(false); 
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    unit: '北京市公安局交管局朝阳支队',
    startTime: '',
    endTime: '',
    accidentTime: '',
    location: '',
    weather: '',
    parties: [] as any[],
  });

  // 续页管理 (for generic records)
  const [extraPages, setExtraPages] = useState<string[]>([]);

  // Auto-fill logic
  useEffect(() => {
    if (locationState.accidentId && MOCK_ACCIDENT_DETAILS[locationState.accidentId as keyof typeof MOCK_ACCIDENT_DETAILS]) {
      const data = MOCK_ACCIDENT_DETAILS[locationState.accidentId as keyof typeof MOCK_ACCIDENT_DETAILS];
      setFormData(prev => ({
        ...prev,
        location: data.location,
        weather: data.weather,
        accidentTime: `${data.date}T${data.time}`,
        startTime: `${data.date}T15:00`,
        endTime: `${data.date}T16:00`,
        parties: data.parties
      }));
      setIsLocked(true); 
    }
  }, [locationState.accidentId]);

  const addPage = () => {
    setExtraPages([...extraPages, '']);
  };

  const removePage = (index: number) => {
    const newPages = [...extraPages];
    newPages.splice(index, 1);
    setExtraPages(newPages);
  };
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async (format: 'pdf' | 'word') => {
    if (format === 'word') {
      alert('正在导出为 WORD 格式...');
      setShowDownloadMenu(false);
      return;
    }
    if (recordType === '现场勘察' && formContainerRef.current) {
      try {
        const { exportInvestigationToPdf } = await import('@/lib/exportInvestigationPdf');
        await exportInvestigationToPdf(formContainerRef.current);
        setShowDownloadMenu(false);
      } catch (e) {
        console.error(e);
        alert('导出 PDF 失败，请稍后重试。');
      }
      return;
    }
    alert(`正在导出为 ${format.toUpperCase()} 格式...`);
    setShowDownloadMenu(false);
  };

  const renderContent = () => {
    switch(recordType) {
      case '事故认定': return <DeterminationForm formData={formData} />;
      case '讯问笔录': return <InterrogationForm formData={formData} extraPages={extraPages} addPage={addPage} removePage={removePage} />;
      case '询问笔录': return <InquiryForm formData={formData} extraPages={extraPages} addPage={addPage} removePage={removePage} />; 
      case '现场勘察':
      default: return <InvestigationForm formData={formData} isLocked={isLocked} />;
    }
  };

  return (
    <Layout title={`文书编辑 - ${recordType}${recordType.includes('笔录')||recordType.includes('书') ? '' : '笔录'}`} showBack>
      <div className="max-w-5xl mx-auto pb-10">
        
        {/* Toolbar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm mb-6 -mx-6 md:mx-0 rounded-b-xl md:rounded-xl md:top-4 md:border print:hidden">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
               <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
                {recordType.includes('笔录') || recordType.includes('书') ? recordType : `${recordType}笔录`}
                {isLocked && recordType === '现场勘察' && (
                  <span className="flex items-center gap-1 text-[10px] bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200" title="关联绘图数据后，核心环境参数不可修改">
                    <Lock size={10} /> 环境参数已锁定
                  </span>
                )}
              </h1>
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-400"></span>
                草稿 - 未归档
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 md:gap-2">
               {locationState.accidentId && (
                  <button
                    onClick={() => navigate(`/accident/${locationState.accidentId}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/50 text-primary bg-primary/5 rounded-md text-sm font-medium hover:bg-primary/10"
                  >
                    <Info size={16} /> <span className="hidden sm:inline">事故详情</span>
                  </button>
               )}
               {(recordType === '讯问笔录' || recordType === '询问笔录') && (
                  <button onClick={addPage} className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-primary text-primary bg-blue-50/50 rounded-md text-sm font-medium hover:bg-blue-50">
                    <FilePlus size={16} /> <span className="hidden sm:inline">续页</span>
                  </button>
               )}
               
               <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">
                 <Printer size={16} /> <span className="hidden sm:inline">打印</span>
               </button>

               <div className="relative">
                 <button 
                   onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                   className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
                 >
                   <Download size={16} /> <span className="hidden sm:inline">下载</span> <ChevronDown size={14} />
                 </button>
                 {showDownloadMenu && (
                   <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                     <button onClick={() => handleDownload('pdf')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">导出 PDF</button>
                     <button onClick={() => handleDownload('word')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">导出 Word</button>
                   </div>
                 )}
               </div>

               <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700">
                 <Save size={16} /> <span className="hidden sm:inline">保存</span>
               </button>
               <button 
                 onClick={() => setShowSignature(true)}
                 className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 shadow-sm"
               >
                 <FileCheck size={16} /> 签署归档
               </button>
            </div>
          </div>
        </div>

        {/* Document Render Area */}
        <div ref={formContainerRef} className="flex flex-col gap-8 print:gap-0">
          {renderContent()}
        </div>

      </div>

      <SignatureModal 
        isOpen={showSignature} 
        onClose={() => setShowSignature(false)} 
        onConfirm={() => {
          setShowSignature(false);
          alert('签名已保存，文书已归档！');
          navigate('/records');
        }}
        mode={recordType === '现场勘察' ? 'record' : 'diagram'}
        totalPages={recordType === '现场勘察' ? 3 : 1}
        recordPreviewSourceRef={recordType === '现场勘察' ? formContainerRef : undefined}
      />
    </Layout>
  );
};

// 1. 现场勘察笔录组件 (Updated - Multi-page)
const InvestigationForm = ({ formData, isLocked }: any) => {
  const [vehicles, setVehicles] = useState([
    { id: 1, type: '', plate: '', gear: '', light: '', dashboard: '', device: '' },
    { id: 2, type: '', plate: '', gear: '', light: '', dashboard: '', device: '' },
    { id: 3, type: '', plate: '', gear: '', light: '', dashboard: '', device: '' },
    { id: 4, type: '', plate: '', gear: '', light: '', dashboard: '', device: '' }, 
    { id: 5, type: '', plate: '', gear: '', light: '', dashboard: '', device: '' },
  ]);

  const [alcoholTests, setAlcoholTests] = useState([
    { id: 1, name: '', idCard: '', phone: '', alcohol: '', drugs: '', sample: '' },
    { id: 2, name: '', idCard: '', phone: '', alcohol: '', drugs: '', sample: '' },
    { id: 3, name: '', idCard: '', phone: '', alcohol: '', drugs: '', sample: '' },
    { id: 4, name: '', idCard: '', phone: '', alcohol: '', drugs: '', sample: '' },
    { id: 5, name: '', idCard: '', phone: '', alcohol: '', drugs: '', sample: '' },
  ]);

  type Vehicle = typeof vehicles[0];
  type AlcoholTest = typeof alcoholTests[0];

  const updateVehicle = (index: number, field: keyof Vehicle, value: string) => {
    const newVehicles = [...vehicles];
    newVehicles[index] = { ...newVehicles[index], [field]: value };
    setVehicles(newVehicles);
  };
  
  const updateAlcoholTest = (index: number, field: keyof AlcoholTest, value: string) => {
    const newTests = [...alcoholTests];
    newTests[index] = { ...newTests[index], [field]: value };
    setAlcoholTests(newTests);
  };

  const PageContainer = ({ children, pageNum, totalPages = '叁', pageIndex }: { children: React.ReactNode; pageNum: string; totalPages?: string; pageIndex?: number }) => (
    <div
      data-record-page={pageIndex !== undefined ? String(pageIndex + 1) : undefined}
      className="bg-white shadow-xl border border-gray-200 p-8 md:p-12 min-h-[297mm] text-gray-900 relative mx-auto print:shadow-none print:border-none print:break-after-page w-full max-w-[210mm] font-serif flex flex-col justify-between"
    >
      <div className="flex-1">
        {children}
      </div>
      <div className="flex justify-between items-center text-xs border-t border-black pt-2 mt-4 font-song">
         <span>共 {totalPages} 页</span>
         <span>第 {pageNum} 页</span>
      </div>
    </div>
  );

  return (
    <>
      {/* PAGE 1: Basic Info, Section 1, Section 2 */}
      <PageContainer pageNum="一" pageIndex={0}>
        <div className="text-center mb-6 border-b-2 border-black pb-4">
            <h1 className="text-2xl font-bold tracking-widest mb-4">道路交通事故现场勘查笔录</h1>
            <div className="flex justify-center gap-8 text-sm checkbox-group">
              <label className="flex items-center gap-1"><input type="checkbox" defaultChecked /> 现场勘查</label>
              <label className="flex items-center gap-1"><input type="checkbox" /> 补充勘查</label>
            </div>
        </div>
        
        <div className="border-2 border-black text-sm mb-4">
          <GridRow label="勘查单位">
            <input type="text" defaultValue={formData.unit} className="w-full bg-transparent outline-none" />
          </GridRow>
          <GridRow label="勘查时间">
            <div className="flex items-center gap-2 w-full">
                <input type="datetime-local" defaultValue={formData.startTime} className="bg-transparent border-b border-gray-400 px-1 text-center flex-1" />
                <span>至</span>
                <input type="datetime-local" defaultValue={formData.endTime} className="bg-transparent border-b border-gray-400 px-1 text-center flex-1" />
            </div>
          </GridRow>
          <GridRow label="事故时间">
             <input type="datetime-local" defaultValue={formData.accidentTime} className="bg-transparent border-b border-gray-400 w-64" readOnly={isLocked} />
          </GridRow>

          {/* Place Info */}
          <div className="grid grid-cols-[100px_1fr] border-b border-black">
              <div className="p-3 font-bold border-r border-black flex items-center justify-center bg-gray-50">事故地点</div>
              <div className="grid grid-rows-auto divide-y divide-black/20">
                <div className="p-2 grid grid-cols-[80px_1fr] gap-2 items-start">
                  <div className="flex flex-col gap-1 items-start">
                     <label className="font-bold text-xs flex items-center gap-1"><input type="checkbox" /> 公路</label>
                  </div>
                  <div className="text-xs space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                         <span className="font-bold">技术等级：</span>
                         <CheckGroup options={['高速','一级','二级','三级','四级','等外']} name="tech_level" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                         <span className="font-bold">行政等级：</span>
                         <CheckGroup options={['国道','省道','县道','乡道','村道','专用公路']} name="admin_level" />
                      </div>
                  </div>
                </div>

                <div className="p-2 flex items-center gap-4 text-xs font-bold border-t border-dashed border-gray-300">
                   <label className="flex items-center gap-1"><input type="checkbox" /> 城市道路</label>
                   <div className="flex flex-wrap gap-x-4">
                      <CheckGroup options={['城市快速路','一般城市道路','单位小区自建路','公共停车场','公共广场','其他城市道路']} name="city_road" />
                   </div>
                </div>
                
                <div className="p-2 grid grid-cols-[80px_1fr] gap-2 items-start border-t border-black/20">
                  <div className="flex flex-col gap-1 items-start pt-1">
                     <label className="font-bold text-xs flex items-center gap-1"><input type="checkbox" /> 路口</label>
                  </div>
                  <div className="text-xs flex flex-wrap gap-3 pt-1">
                      <CheckGroup options={['三枝分叉口','四枝分叉口','多枝分叉口','环形交叉口','匝道口']} name="intersection" />
                  </div>
                </div>

                <div className="p-2 grid grid-cols-[80px_1fr] gap-2 items-start border-t border-dashed border-gray-300">
                  <div className="flex flex-col gap-1 items-start pt-1">
                     <label className="font-bold text-xs flex items-center gap-1"><input type="checkbox" /> 路段</label>
                  </div>
                  <div className="text-xs flex flex-wrap gap-x-3 gap-y-1 pt-1">
                      <CheckGroup options={['普通路段','高架路段','变窄路段','窄路','桥梁','隧道','路段进出处','路侧险要路段']} name="segment" />
                      <div className="flex items-center gap-1 w-full mt-1">
                         <input type="checkbox" /> 其他特殊路段：
                         <input className="border-b border-black flex-1 bg-transparent outline-none" />
                      </div>
                  </div>
                </div>

                <div className="p-2 flex gap-4 text-xs items-center border-t border-black/20">
                   <div className="flex items-center gap-2 flex-1">
                      <span className="font-bold">路名：</span>
                      <input className="border-b border-black flex-1 bg-transparent outline-none" />
                   </div>
                   <div className="flex items-center gap-2 flex-1">
                      <span className="font-bold">路号(公路)：</span>
                      <input className="border-b border-black flex-1 bg-transparent outline-none" />
                   </div>
                </div>

                <div className="p-2 grid grid-cols-[80px_1fr] gap-2 items-center border-t border-black/20">
                  <span className="font-bold text-xs">位置</span>
                  <div className="flex gap-4 text-xs">
                    <span>卫星定位 经度:_____________</span>
                    <span>纬度:_____________</span>
                  </div>
                </div>
                <div className="p-2 min-h-[40px]">
                  <input className="w-full outline-none text-xs" placeholder="地点描述..." defaultValue={formData.location} readOnly={isLocked} />
                </div>
              </div>
          </div>

          <GridRow label="天 气">
             <CheckGroup options={['晴','阴','多云','雨','雪','雾','冰雹','沙尘','霾']} name="weather" value={formData.weather} disabled={isLocked} />
             <label className="flex items-center gap-1 ml-4"><input type="checkbox" /> 其他______</label>
          </GridRow>

          {/* Section 1 */}
          <SectionHeader title="一、事故现场道路环境及监控设备情况" />
          <div className="p-4 space-y-2 border-b border-black text-xs">
             <LineCheck label="影响视线障碍物" options={['无', '有:__________']} />
             
             <div className="flex flex-wrap items-center">
                <span className="font-bold mr-2 w-32 shrink-0">道路交通标志：</span>
                <label className="mr-4 flex items-center gap-1"><input type="checkbox" /> 无</label>
                <div className="flex items-center gap-2 flex-1">
                   <label className="flex items-center gap-1"><input type="checkbox" /> 有：</label>
                   <input className="border-b border-black flex-1 min-w-[100px] outline-none" placeholder="描述标志" />
                   <span className="font-bold">其中限速标志值：</span>
                   <input className="border-b border-black w-20 outline-none" />
                </div>
             </div>
             
             <LineCheck label="道路交通标线" options={['无', '有:__________']} />
             <LineCheck label="中央隔离设施" options={['无', '有:__________']} />
             <LineCheck label="路侧防护设施" options={['无', '有:__________']} />
             
             <div className="flex flex-wrap items-center mt-1">
               <span className="font-bold mr-2 w-32 shrink-0">路面材料：</span>
               <CheckGroup options={['沥青', '水泥', '砂石', '土路']} value={isLocked ? '沥青' : ''} />
               <label className="flex items-center gap-1 ml-4"><input type="checkbox" /> 其他______</label>
             </div>
             
             <div className="flex flex-wrap items-center mt-1">
               <span className="font-bold mr-2 w-32 shrink-0">路面状况：</span>
               <CheckGroup options={['路面完好', '施工', '凹凸', '塌陷', '路障']} />
               <label className="flex items-center gap-1 ml-4"><input type="checkbox" /> 其他______</label>
             </div>
             
             <div className="flex flex-wrap items-center mt-1">
               <span className="font-bold mr-2 w-32 shrink-0">路表情况：</span>
               <CheckGroup options={['干燥', '潮湿', '积水', '漫水', '冰雪', '泥泞']} value={isLocked ? '干燥' : ''} />
               <label className="flex items-center gap-1 ml-4"><input type="checkbox" /> 其他______</label>
             </div>
             
             <div className="flex flex-wrap items-center mt-1">
                <span className="font-bold mr-2 w-32 shrink-0">照明情况：</span>
                <CheckGroup options={['白天']} />
                <div className="flex items-center gap-2 ml-4">
                   <span>夜间路灯照明 (</span>
                   <CheckGroup options={['有', '无']} />
                   <span>)</span>
                </div>
             </div>

             <div className="flex flex-wrap items-center mt-1">
                <span className="font-bold mr-2 w-32 shrink-0">监控设备情况：</span>
                <label className="mr-4 flex items-center gap-1"><input type="checkbox" /> 未发现</label>
                <div className="flex items-center gap-2 flex-1">
                   <label className="flex items-center gap-1"><input type="checkbox" /> 发现：</label>
                   <input className="border-b border-black flex-1 outline-none" placeholder="描述位置种类" />
                </div>
             </div>

             <div className="w-full border-b border-black mt-2 pt-1 pb-1">其他需要记录的情况：</div>
          </div>

          {/* Section 2 */}
          <SectionHeader title="二、现场伤亡人员基本情况及救援" />
          <div className="p-4 space-y-3 border-b border-black text-xs">
             <div className="flex gap-4">
                <span>当场死亡 ( 0 ) 人。死亡确认方式：</span>
                <CheckGroup options={['急救医生','法医','其他______']} />
             </div>
             <div>受 伤 ( 1 ) 人。</div>
             <div className="w-full border-b border-black py-1">受伤人员去向：朝阳医院</div>
             <LineCheck label="是否涉及危险物品" options={['否', '是 名称:__________']} />
             
             <div className="mt-2 font-bold">相关部门和人员到达情况：</div>
             <div className="grid grid-cols-1 gap-1 pl-4">
                <div className="flex gap-2 items-center">
                   <span className="w-12">① 医疗:</span>
                   <input className="border-b border-black w-32 outline-none" placeholder="人员姓名" />
                   <span>到达时间:</span>
                   <input type="datetime-local" className="border-b border-black outline-none w-36" />
                </div>
                <div className="flex gap-2 items-center">
                   <span className="w-12">② 消防:</span>
                   <input className="border-b border-black w-32 outline-none" placeholder="人员姓名" />
                   <span>到达时间:</span>
                   <input type="datetime-local" className="border-b border-black outline-none w-36" />
                </div>
                <div className="flex gap-2 items-center">
                   <span className="w-12">③ 清障:</span>
                   <input className="border-b border-black w-32 outline-none" placeholder="人员姓名" />
                   <span>到达时间:</span>
                   <input type="datetime-local" className="border-b border-black outline-none w-36" />
                </div>
                <div className="flex gap-2 items-center">
                   <span className="w-12">④ 其他:</span>
                   <input className="border-b border-black w-32 outline-none" placeholder="人员姓名" />
                   <span>到达时间:</span>
                   <input type="datetime-local" className="border-b border-black outline-none w-36" />
                </div>
             </div>
          </div>
        </div>
      </PageContainer>

      {/* PAGE 2: Section 3, Section 4 */}
      <PageContainer pageNum="二" pageIndex={1}>
        <div className="border-2 border-black text-sm">
          {/* Section 3: Vehicles */}
          <SectionHeader title="三、现场车辆情况" />
          <div className="border-b border-black overflow-hidden relative">
             <table className="w-full text-center text-[10px] divide-y divide-black border-collapse">
                <thead>
                  <tr className="divide-x divide-black bg-gray-50">
                    <th className="p-2 w-8">编号</th>
                    <th className="p-2 w-16">车辆类型</th>
                    <th className="p-2">号牌号码或其他特征标识</th>
                    <th className="p-1 w-10">车辆挡位</th>
                    <th className="p-1 w-10">灯光开启情况</th>
                    <th className="p-1 w-16">车辆仪表指示状态</th>
                    <th className="p-2">车载设备安装情况(A-行车行驶记录仪/B-行车视频记录仪/C-其他)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {vehicles.map((v, i) => (
                    <tr key={i} className="divide-x divide-black h-8 hover:bg-gray-50">
                       <td className="p-1">{i + 1}</td>
                       <td className="p-0"><input className="w-full h-full text-center bg-transparent outline-none" value={v.type} onChange={e => updateVehicle(i, 'type', e.target.value)} /></td>
                       <td className="p-0"><input className="w-full h-full text-center bg-transparent outline-none" value={v.plate} onChange={e => updateVehicle(i, 'plate', e.target.value)} /></td>
                       <td className="p-0"><input className="w-full h-full text-center bg-transparent outline-none" value={v.gear} onChange={e => updateVehicle(i, 'gear', e.target.value)} /></td>
                       <td className="p-0"><input className="w-full h-full text-center bg-transparent outline-none" value={v.light} onChange={e => updateVehicle(i, 'light', e.target.value)} /></td>
                       <td className="p-0"><input className="w-full h-full text-center bg-transparent outline-none" value={v.dashboard} onChange={e => updateVehicle(i, 'dashboard', e.target.value)} /></td>
                       <td className="p-0"><input className="w-full h-full text-center bg-transparent outline-none" value={v.device} onChange={e => updateVehicle(i, 'device', e.target.value)} /></td>
                    </tr>
                  ))}
                </tbody>
             </table>
             <button onClick={() => setVehicles([...vehicles, { id: vehicles.length+1, type: '', plate: '', gear: '', light: '', dashboard: '', device: '' }])} className="absolute top-1 right-1 print:hidden p-1 text-blue-500 hover:bg-blue-50 rounded">
                <Plus size={14} />
             </button>
          </div>

          {/* Section 4 Updated */}
          <SectionHeader title="四、现场痕迹物证及固定、提取情况" />
          <div className="flex flex-col text-xs divide-y divide-black border-b border-black">
             <div className="p-2">
                <div className="font-bold mb-1">(一) 地面痕迹</div>
                <textarea className="w-full h-16 resize-none bg-transparent outline-none" placeholder="如有请填写..." />
             </div>
             <div className="p-2">
                <div className="font-bold mb-1">(二) 车体痕迹</div>
                <textarea className="w-full h-16 resize-none bg-transparent outline-none" placeholder="如有请填写..." />
             </div>
             <div className="p-2">
                <div className="font-bold mb-1">(三) 人体痕迹</div>
                <textarea className="w-full h-16 resize-none bg-transparent outline-none" placeholder="如有请填写..." />
             </div>
             <div className="p-2">
                <div className="font-bold mb-1">(四) 物证</div>
                <textarea className="w-full h-16 resize-none bg-transparent outline-none" placeholder="如有请填写..." />
             </div>
             <div className="p-2">
                <div className="font-bold mb-1 flex items-center gap-2">
                  (五) 其他 
                  <input className="flex-1 border-b border-black outline-none" />
                </div>
                <div className="min-h-[20px]"></div>
             </div>
          </div>
        </div>
      </PageContainer>

      {/* PAGE 3: Section 5-8, Signatures */}
      <PageContainer pageNum="三" pageIndex={2}>
         <div className="border-2 border-black text-sm">
           {/* Section 5: Alcohol/Drugs */}
           <SectionHeader title="五、对车辆驾驶人或驾车嫌疑人酒精含量、国家管制的精神和麻醉药品测试的结果以及提取血样、尿样情况" />
           <div className="border-b border-black overflow-hidden relative">
              <table className="w-full text-center text-[10px] divide-y divide-black border-collapse">
                 <thead>
                   <tr className="divide-x divide-black bg-gray-50">
                     <th className="p-2 w-8">编号</th>
                     <th className="p-2 w-16">姓名</th>
                     <th className="p-2">身份证明号码</th>
                     <th className="p-2 w-24">联系电话</th>
                     <th className="p-2">呼气酒精含量测试结果</th>
                     <th className="p-2">国家管制精神药品和麻醉药品测试结果</th>
                     <th className="p-2 w-16">是否抽血或提取尿样</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-black">
                   {alcoholTests.map((t, i) => (
                     <tr key={i} className="divide-x divide-black h-8 hover:bg-gray-50">
                        <td className="p-1">{i + 1}</td>
                        <td className="p-0"><input className="w-full h-full text-center bg-transparent outline-none" value={t.name} onChange={e => updateAlcoholTest(i, 'name', e.target.value)} /></td>
                        <td className="p-0"><input className="w-full h-full text-center bg-transparent outline-none" value={t.idCard} onChange={e => updateAlcoholTest(i, 'idCard', e.target.value)} /></td>
                        <td className="p-0"><input className="w-full h-full text-center bg-transparent outline-none" value={t.phone} onChange={e => updateAlcoholTest(i, 'phone', e.target.value)} /></td>
                        <td className="p-0"><input className="w-full h-full text-center bg-transparent outline-none" value={t.alcohol} onChange={e => updateAlcoholTest(i, 'alcohol', e.target.value)} /></td>
                        <td className="p-0"><input className="w-full h-full text-center bg-transparent outline-none" value={t.drugs} onChange={e => updateAlcoholTest(i, 'drugs', e.target.value)} /></td>
                        <td className="p-0"><input className="w-full h-full text-center bg-transparent outline-none" value={t.sample} onChange={e => updateAlcoholTest(i, 'sample', e.target.value)} /></td>
                     </tr>
                   ))}
                 </tbody>
              </table>
              <button onClick={() => setAlcoholTests([...alcoholTests, { id: alcoholTests.length+1, name: '', idCard: '', phone: '', alcohol: '', drugs: '', sample: '' }])} className="absolute top-1 right-1 print:hidden p-1 text-blue-500 hover:bg-blue-50 rounded">
                 <Plus size={14} />
              </button>
           </div>
           
           {/* Section 6 */}
           <SectionHeader title="六、肇事车辆类型、号牌号码、车身颜色、驶离路线、方向、驾乘人员等情况" />
           <div className="p-2 border-b border-black">
              <textarea className="w-full h-24 resize-none bg-transparent outline-none" placeholder="记录相关情况..." />
           </div>

           {/* Section 7 */}
           <SectionHeader title="七、现场采取强制措施情况" />
           <div className="p-2 border-b border-black">
              <textarea className="w-full h-24 resize-none bg-transparent outline-none" placeholder="记录相关情况..." />
           </div>

           {/* Section 8 */}
           <SectionHeader title="八、勘查现场的交通警察认为应当记录的其他情况" />
           <div className="p-2 border-b border-black">
              <textarea className="w-full h-24 resize-none bg-transparent outline-none" placeholder="记录相关情况..." />
           </div>

           {/* Signatures */}
           <div className="grid grid-cols-2 text-center h-20 divide-x divide-black border-t border-black">
               <div className="flex flex-col items-start justify-center p-4 gap-2">
                  <span className="font-bold">现场勘查人员签名：</span>
                  <div className="w-full h-10 bg-gray-50 border-b border-dashed border-gray-300"></div>
               </div>
               <div className="flex flex-col items-start justify-center p-4 gap-2">
                  <span className="font-bold">记录人签名：</span>
                  <div className="w-full h-10 bg-gray-50 border-b border-dashed border-gray-300"></div>
               </div>
           </div>
           <div className="grid grid-cols-2 text-center h-20 divide-x divide-black border-t border-black">
               <div className="flex flex-col items-start justify-center p-4 gap-2">
                  <span className="font-bold">当事人签名：</span>
                  <div className="w-full h-10 bg-gray-50 border-b border-dashed border-gray-300"></div>
               </div>
               <div className="flex flex-col items-start justify-center p-4 gap-2">
                  <span className="font-bold">见证人签名：</span>
                  <div className="w-full h-10 bg-gray-50 border-b border-dashed border-gray-300"></div>
               </div>
           </div>
         </div>
      </PageContainer>
    </>
  );
};

// 2. 事故认定书组件 (Updated Layout)
const DeterminationForm = ({ formData }: any) => {
  const PageContainer = ({ children }: any) => (
    <div className="bg-white shadow-xl border border-gray-200 p-8 md:p-12 min-h-[297mm] text-gray-900 relative mx-auto print:shadow-none print:border-none w-full max-w-[210mm] font-serif">
      {children}
    </div>
  );

  return (
    <PageContainer>
      <div className="text-center mb-6 relative">
         <h2 className="text-sm border-b border-black inline-block px-10 mb-2">公安局交通警察支队______大队</h2>
         <h1 className="text-2xl font-bold tracking-widest mt-2">道路交通事故认定书(简易程序)</h1>
         <div className="absolute right-0 top-10 text-sm">第 ___________ 号</div>
      </div>

      <div className="border-2 border-black text-sm">
         <div className="grid grid-cols-2 divide-x divide-black border-b border-black">
             <div className="flex items-center p-2">
                <span className="font-bold w-20 text-center">事故时间</span>
                <input defaultValue={formData.accidentTime} className="flex-1 bg-transparent border-none text-xs" />
             </div>
             <div className="flex items-center p-2">
                <span className="font-bold w-20 text-center">天 气</span>
                <input defaultValue={formData.weather} className="flex-1 bg-transparent border-none text-xs" />
             </div>
         </div>
         <GridRow label="事故地点">
            <input defaultValue={formData.location} className="w-full bg-transparent border-none" />
         </GridRow>

         {/* Updated Parties Table with Vehicle Type */}
         <div className="border-b border-black">
            <table className="w-full text-center text-xs divide-y divide-black">
               <thead className="bg-gray-50">
                  <tr className="divide-x divide-black">
                     <th className="p-2 w-16">当事人</th>
                     <th className="p-2">驾驶证或身份证号</th>
                     <th className="p-2 w-24">联系方式</th>
                     <th className="p-2 w-20">交通方式</th>
                     <th className="p-2 w-20">车辆类型</th>
                     <th className="p-2">车辆牌号/保险公司</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-black">
                 {formData.parties.length > 0 ? formData.parties.map((p: any, i: number) => (
                    <tr key={i} className="divide-x divide-black">
                       <td className="p-2">{p.name}</td>
                       <td className="p-2">{p.idCard}</td>
                       <td className="p-2">{p.phone}</td>
                       <td className="p-2">{p.type.includes('车') ? '驾车' : '步行'}</td>
                       <td className="p-2">{p.type}</td>
                       <td className="p-2">{p.plate} / ________</td>
                    </tr>
                 )) : (
                    <>
                       <tr className="h-10 divide-x divide-black"><td>甲</td><td></td><td></td><td></td><td></td><td></td></tr>
                       <tr className="h-10 divide-x divide-black"><td>乙</td><td></td><td></td><td></td><td></td><td></td></tr>
                    </>
                 )}
               </tbody>
            </table>
         </div>

         {/* Updated Facts */}
         <div className="border-b border-black min-h-[300px] p-2 flex flex-col relative bg-white">
            <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-black flex items-center justify-center bg-gray-50 text-center font-bold text-xs p-1">
              交<br/>通<br/>事<br/>故<br/>事<br/>实<br/>及<br/>责<br/>任
            </div>
            <div className="pl-10 pt-1 space-y-4">
               <div className="flex flex-col gap-2 text-xs">
                  <label className="flex items-center gap-2"><input type="checkbox" /> 财产损失事故</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> 受伤当事人伤势轻微，各方当事人一致同意适用简易程序处理</label>
               </div>
               <p className="mt-2 text-sm leading-8" style={{backgroundImage: 'linear-gradient(transparent 95%, #ddd 95%)', backgroundSize: '100% 2rem'}}>
                  {formData.accidentTime ? `${new Date(formData.accidentTime).toLocaleString()}，` : '____年__月__日__时__分，'}
                  {formData.parties.map((p: any) => p.name).join('与')}在{formData.location}发生交通事故。
                  经查，___________________________________________________________________
                  __________________________________________________________________________
                  __________________________________________________________________________。
               </p>
               
               <div className="mt-12 flex justify-between pr-8 align-bottom text-xs">
                  <div className="flex flex-col gap-8">
                     <div>当事人(签名)：</div>
                  </div>
                  <div className="flex flex-col gap-8 text-right">
                     <div className="relative">
                       交通警察(签名/盖章)：
                       <div className="absolute -top-6 -right-2 w-20 h-20 border-2 border-red-500 rounded-full opacity-30 rotate-12 flex items-center justify-center text-red-500 font-bold text-xs">
                          (专用章)
                       </div>
                     </div>
                     <div>记录时间：____年__月__日</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Updated Mediation */}
         <div className="min-h-[180px] p-2 flex flex-col relative bg-white">
           <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-black flex items-center justify-center bg-gray-50 text-center font-bold text-xs p-1">
              损<br/>害<br/>赔<br/>偿<br/>调<br/>解<br/>结<br/>果
           </div>
            <div className="pl-10 pt-1">
               <p className="leading-8 min-h-[80px]" style={{backgroundImage: 'linear-gradient(transparent 95%, #ddd 95%)', backgroundSize: '100% 2rem'}}>
                  经调解，当事人达成如下协议：_____________________________________________
                  __________________________________________________________________________
               </p>
               <div className="mt-8 flex justify-between pr-8 align-bottom text-xs">
                  <div className="flex flex-col gap-8">
                     <div>当事人(签名)：</div>
                  </div>
                  <div className="flex flex-col gap-8 text-right">
                     <div className="relative">
                       交通警察(签名/盖章)：
                       <div className="absolute -top-6 -right-2 w-20 h-20 border-2 border-red-500 rounded-full opacity-30 rotate-12 flex items-center justify-center text-red-500 font-bold text-xs">
                          (专用章)
                       </div>
                     </div>
                     <div>记录时间：____年__月__日</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      
      {/* Updated Footer */}
      <div className="text-[10px] mt-2 space-y-1 text-gray-700 leading-tight">
         <p>● 当事人对交通事故认定有异议的，可以自本道路交通事故认定书送达之日起三日（工作日）内提出书面复核申请。同一事故的复核以一次为限。损害赔偿有争议的，当事人可以申请人民调解委员会调解，或者向人民法院提起民事诉讼。</p>
         <p>● 本道路交通事故认定书一式多份，送达各方当事人各一份，一份附卷。</p>
         <div className="mt-2 pt-2 border-t border-dashed border-gray-400">
            <label className="flex items-center gap-2">
               <input type="checkbox" /> 本道路交通事故认定书为经复核重新作出，原道路交通事故认定书（编号：<span className="border-b border-black w-24 inline-block"></span>）予以撤销。
            </label>
         </div>
      </div>
    </PageContainer>
  );
};

// 3. 讯问笔录组件 (Updated)
const InterrogationForm = ({ formData, extraPages, addPage, removePage }: any) => {
  const PageContainer = ({ children }: any) => (
    <div className="bg-white shadow-xl border border-gray-200 p-8 md:p-12 min-h-[297mm] text-gray-900 relative mx-auto print:shadow-none print:border-none w-full max-w-[210mm] font-serif">
      {children}
    </div>
  );
  return (
     <PageContainer>
       <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-[1em] mb-4">讯问笔录</h1>
          <div className="flex justify-end pr-4 text-sm">第 _____ 次</div>
       </div>

       <div className="border border-transparent space-y-4 text-sm font-song">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
             <UnderlineInput label="时间" value={`${formData.startTime?.replace('T',' ')} 至 ${formData.endTime?.replace('T',' ')}`} />
             <UnderlineInput label="地点" value="交警大队讯问室" />
             <div className="flex items-end gap-2">
                <span className="shrink-0">讯问人：</span>
                <div className="border-b border-black flex-1 min-h-[1.5em] flex gap-4">
                   <div className="bg-gray-100 flex-1 h-full cursor-pointer hover:bg-gray-200 text-center text-gray-400 text-xs flex items-center justify-center">点击签名</div>
                   <div className="bg-gray-100 flex-1 h-full cursor-pointer hover:bg-gray-200 text-center text-gray-400 text-xs flex items-center justify-center">点击签名</div>
                </div>
             </div>
             <UnderlineInput label="工作单位" value={formData.unit} />
             <div className="flex items-end gap-2">
                <span className="shrink-0">记录人：</span>
                <div className="border-b border-black flex-1 min-h-[1.5em] bg-gray-100 cursor-pointer hover:bg-gray-200 text-center text-gray-400 text-xs flex items-center justify-center">点击签名</div>
             </div>
             <UnderlineInput label="工作单位" value={formData.unit} />
          </div>

          <div className="border-t-2 border-black my-4"></div>

          {/* Suspect Info */}
          <div className="space-y-3">
             <div className="flex gap-4">
                <UnderlineInput label="被讯问人" className="w-[120px]" />
                <UnderlineInput label="性别" className="w-16" />
                <UnderlineInput label="年龄" className="w-16" />
                <UnderlineInput label="出生日期" className="flex-1" />
             </div>
             <div className="flex gap-4 items-end">
                <UnderlineInput label="身份证种类及号码" className="flex-1" />
                <div className="flex items-center gap-2 min-w-[120px] pb-1">
                   <span className="font-bold">是否为人大代表：</span>
                   <label><input type="checkbox" /> 是</label>
                   <label><input type="checkbox" /> 否</label>
                </div>
             </div>
             <UnderlineInput label="现住址" />
             <UnderlineInput label="户籍所在地" />
             <UnderlineInput label="联系方式" />
             
             <div className="flex items-end gap-2 mt-4 text-xs">
                <span>被讯问人签字：</span>
                <div className="border-b border-black flex-1 min-h-[1.5em] flex gap-4">
                    <div className="bg-gray-100 w-32 h-6 cursor-pointer text-center text-gray-400">签字区域</div>
                </div>
             </div>
          </div>

          <div className="border-t-2 border-black my-4"></div>

          {/* Empty Q&A Lines */}
          <div className="leading-[3rem] min-h-[400px]" style={{ backgroundImage: 'linear-gradient(transparent 96%, #000 96%)', backgroundSize: '100% 3rem' }}>
             {/* Deleted previous preset questions */}
          </div>
          
          {/* Extra Pages */}
          {extraPages.map((_: any, idx: number) => (
             <div key={idx} className="mt-8 pt-8 border-t-4 border-double border-gray-300 relative group">
                <button onClick={() => removePage(idx)} className="absolute top-0 right-0 p-2 text-red-500 opacity-0 group-hover:opacity-100">
                  <Trash2 size={20} />
                </button>
                <div className="text-center font-bold text-lg mb-4">讯问笔录（续页 {idx+1}）</div>
                <div className="leading-[3rem] min-h-[600px]" style={{ backgroundImage: 'linear-gradient(transparent 96%, #000 96%)', backgroundSize: '100% 3rem' }}></div>
             </div>
          ))}
       </div>

       <div className="mt-8 flex justify-end gap-12 font-bold text-sm">
           <div>第 _____ 页</div>
           <div>共 {1 + extraPages.length} 页</div>
       </div>
     </PageContainer>
  );
};

// 4. 询问笔录组件 (Updated)
const InquiryForm = ({ formData, extraPages, addPage, removePage }: any) => {
   const PageContainer = ({ children }: any) => (
     <div className="bg-white shadow-xl border border-gray-200 p-8 md:p-12 min-h-[297mm] text-gray-900 relative mx-auto print:shadow-none print:border-none w-full max-w-[210mm] font-serif">
       {children}
     </div>
   );
   return (
      <PageContainer>
        <div className="text-center mb-6">
           <h1 className="text-3xl font-bold tracking-[1em] mb-4">询问笔录</h1>
           <div className="flex justify-end pr-4 text-sm">第 _____ 次</div>
        </div>

        <div className="border border-transparent space-y-4 text-sm font-song">
           {/* Header Info - Multiple Inquirers */}
           <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <UnderlineInput label="时间" value={`${formData.startTime?.replace('T',' ')} 至 ${formData.endTime?.replace('T',' ')}`} />
              <UnderlineInput label="地点" />
              <div className="flex items-end gap-2">
                <span className="shrink-0">询问人：</span>
                <div className="border-b border-black flex-1 min-h-[1.5em] flex gap-4">
                   <div className="bg-gray-100 flex-1 h-full cursor-pointer hover:bg-gray-200 text-center text-gray-400 text-xs flex items-center justify-center">点击签名</div>
                   <div className="bg-gray-100 flex-1 h-full cursor-pointer hover:bg-gray-200 text-center text-gray-400 text-xs flex items-center justify-center">点击签名</div>
                </div>
              </div>
              <UnderlineInput label="工作单位" value={formData.unit} />
              <div className="flex items-end gap-2">
                <span className="shrink-0">记录人：</span>
                <div className="border-b border-black flex-1 min-h-[1.5em] bg-gray-100 cursor-pointer hover:bg-gray-200 text-center text-gray-400 text-xs flex items-center justify-center">点击签名</div>
             </div>
              <UnderlineInput label="工作单位" value={formData.unit} />
           </div>

           <div className="border-t-2 border-black my-4"></div>

           {/* Witness Info */}
           <div className="space-y-3">
              <div className="flex gap-4">
                 <UnderlineInput label="被询问人" className="w-[120px]" />
                 <UnderlineInput label="性别" className="w-16" />
                 <UnderlineInput label="年龄" className="w-16" />
                 <UnderlineInput label="出生日期" className="flex-1" />
              </div>
              <div className="flex gap-4 items-end">
                <UnderlineInput label="身份证种类及号码" className="flex-1" />
                <div className="flex items-center gap-2 min-w-[120px] pb-1">
                   <span className="font-bold">是否为人大代表：</span>
                   <label><input type="checkbox" /> 是</label>
                   <label><input type="checkbox" /> 否</label>
                </div>
             </div>
              <UnderlineInput label="现住址" />
              <UnderlineInput label="联系方式" />
              <UnderlineInput label="户籍所在地" />
              
              <div className="flex items-end gap-2 mt-4 text-xs">
                <span>被询问人签字：</span>
                <div className="border-b border-black flex-1 min-h-[1.5em] flex gap-4">
                    <div className="bg-gray-100 w-32 h-6 cursor-pointer text-center text-gray-400">签字区域</div>
                </div>
             </div>
           </div>

           <div className="border-t-2 border-black my-4"></div>

           {/* Blank Lines for Q&A */}
           <div className="leading-[3rem] min-h-[400px]" style={{ backgroundImage: 'linear-gradient(transparent 96%, #000 96%)', backgroundSize: '100% 3rem' }}>
              {/* Deleted previous preset questions */}
           </div>

           {/* Extra Pages */}
           {extraPages.map((_: any, idx: number) => (
             <div key={idx} className="mt-8 pt-8 border-t-4 border-double border-gray-300 relative group">
                <button onClick={() => removePage(idx)} className="absolute top-0 right-0 p-2 text-red-500 opacity-0 group-hover:opacity-100">
                  <Trash2 size={20} />
                </button>
                <div className="text-center font-bold text-lg mb-4">询问笔录（续页 {idx+1}）</div>
                <div className="leading-[3rem] min-h-[600px]" style={{ backgroundImage: 'linear-gradient(transparent 96%, #000 96%)', backgroundSize: '100% 3rem' }}></div>
             </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-end gap-12 font-bold text-sm">
           <div>第 _____ 页</div>
           <div>共 {1 + extraPages.length} 页</div>
       </div>
      </PageContainer>
   );
};

// --- Helper Components ---

const GridRow = ({ label, children }: any) => (
  <div className="grid grid-cols-[100px_1fr] border-b border-black">
    <div className="p-3 font-bold border-r border-black flex items-center justify-center bg-gray-50">{label}</div>
    <div className="p-2 flex items-center">{children}</div>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="p-2 bg-gray-100 font-bold border-b border-black text-center text-sm">{title}</div>
);

const CheckGroup = ({ options, name, value, disabled }: any) => (
  <>
    {options.map((opt: string) => (
      <label key={opt} className={cn("flex items-center gap-1 mr-2", disabled && value !== opt && "opacity-50")}>
        <input type="checkbox" name={name} defaultChecked={value === opt} disabled={disabled} /> {opt}
      </label>
    ))}
  </>
);

const LineCheck = ({ label, options, value }: any) => (
  <div className="flex flex-wrap items-center text-xs">
     <span className="font-bold mr-2 w-32 shrink-0">{label}：</span>
     {options.map((opt: string) => (
       <label key={opt} className="mr-4 flex items-center gap-1">
         <input type="checkbox" defaultChecked={value === opt} /> {opt}
       </label>
     ))}
  </div>
);

const UnderlineInput = ({ label, value, className }: any) => (
  <div className={cn("flex items-end gap-2", className)}>
    <span className="shrink-0">{label}：</span>
    <div className="border-b border-black flex-1 px-2 pb-0.5 min-h-[1.5em]">{value}</div>
  </div>
);

export default RecordEditor;