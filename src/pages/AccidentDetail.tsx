import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { 
  Save, ArrowLeft, Wand2, Plus, Trash2, 
  MapPin, Calendar, Cloud, Compass, User, Car,
  FileText, PenTool, AlertCircle, Camera
} from 'lucide-react';

const DATA_SOURCE_OPTIONS = ['无人机拍摄', '手持设备拍摄', '行车记录仪拍摄', '其他来源'] as const;
import { cn } from '@/lib/utils';

const AccidentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'basic' | 'parties' | 'vehicles'>('basic');
  const [description, setDescription] = useState('');
  const [dataSource, setDataSource] = useState<string>(DATA_SOURCE_OPTIONS[0]);

  // 模拟数据状态
  const [parties, setParties] = useState([{ id: 1, name: '', type: '驾驶员', res: '全部责任' }]);
  const [vehicles, setVehicles] = useState([{ id: 1, plate: '', type: '小型轿车', action: '追尾' }]);

  const generateDesc = () => {
    setDescription(`2024年5月18日14时20分，在建设路与人民路交叉口，天气晴，路面干燥沥青。当事人1驾驶车辆（${vehicles[0].type}）因${vehicles[0].action}造成事故，负全部责任。现场勘查完毕，具体情况见现场图。`);
  };

  return (
    <DashboardLayout title={id ? "事故详情编辑" : "新建事故登记"} showBack>
      <div className="max-w-[1600px] mx-auto flex flex-col h-full lg:flex-row gap-6 pb-6">
        
        {/* Left Column: Extensive Data Entry Form */}
        <div className="flex-1 bg-white rounded-xl shadow-custom flex flex-col overflow-hidden border border-gray-100 max-h-[calc(100vh-140px)]">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 flex-shrink-0 bg-gray-50/50">
            {[
              { id: 'basic', label: '基础信息', icon: Compass },
              { id: 'parties', label: '当事人信息', icon: User },
              { id: 'vehicles', label: '车辆信息', icon: Car },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all duration-200 hover:bg-white",
                  activeTab === tab.id 
                    ? "border-primary text-primary bg-white shadow-sm" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                <tab.icon size={18} className={activeTab === tab.id ? "text-primary" : "text-gray-400"} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <FormGroup label="到达现场时间" icon={Calendar}>
                  <input type="datetime-local" className="form-input" />
                </FormGroup>
                <FormGroup label="绘图时间" icon={Calendar}>
                  <input type="datetime-local" className="form-input" />
                </FormGroup>
                <FormGroup label="事故地点" icon={MapPin} className="md:col-span-2">
                   <div className="relative">
                      <textarea className="form-input resize-none h-24 pt-3 leading-relaxed" placeholder="请输入详细地址，包含路名、方向、参照物等" />
                      <MapPin className="absolute right-3 bottom-3 text-gray-300" size={20}/>
                   </div>
                </FormGroup>
                <FormGroup label="天气状况" icon={Cloud}>
                  <select className="form-input">
                    <option>晴</option><option>阴</option><option>雨</option><option>雪</option><option>雾</option>
                  </select>
                </FormGroup>
                <FormGroup label="路面性质" icon={FileText}>
                  <select className="form-input">
                    <option>沥青</option><option>水泥</option><option>土路</option><option>沙石</option>
                  </select>
                </FormGroup>
                <FormGroup label="数据来源" icon={Camera}>
                  <select
                    className="form-input"
                    value={dataSource}
                    onChange={(e) => setDataSource(e.target.value)}
                  >
                    {DATA_SOURCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">事故现场实景图来源</p>
                </FormGroup>
              </div>
            )}

            {activeTab === 'parties' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {parties.map((p, idx) => (
                  <div key={p.id} className="bg-gray-50 p-5 rounded-xl border border-gray-200 relative group hover:border-blue-200 transition-colors">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary text-white text-xs px-2 py-0.5 rounded font-bold">P{idx + 1}</span>
                        <span className="font-bold text-sm text-gray-800">当事人信息</span>
                      </div>
                      <button onClick={() => setParties(parties.filter(x => x.id !== p.id))} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={16}/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-xs font-medium text-gray-500">姓名</label><input className="form-input bg-white" placeholder="请输入姓名" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium text-gray-500">联系电话</label><input type="tel" className="form-input bg-white" placeholder="138xxxxxxx" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium text-gray-500">身份证号</label><input className="form-input bg-white uppercase" placeholder="身份证号" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium text-gray-500">责任认定</label>
                        <select className="form-input bg-white text-primary font-bold"><option>全部责任</option><option>主要责任</option><option>同等责任</option><option>次要责任</option><option>无责任</option></select>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => setParties([...parties, { id: Date.now(), name: '', type: '行人', res: '无' }])} 
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <Plus size={20} /> 添加当事人
                </button>
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 {vehicles.map((v, idx) => (
                  <div key={v.id} className="bg-gray-50 p-5 rounded-xl border border-gray-200 relative group hover:border-blue-200 transition-colors">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded font-bold">V{idx + 1}</span>
                        <span className="font-bold text-sm text-gray-800">车辆信息</span>
                      </div>
                      <button onClick={() => setVehicles(vehicles.filter(x => x.id !== v.id))} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={16}/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-xs font-medium text-gray-500">车牌号码</label><input className="form-input bg-white uppercase font-bold text-gray-800" placeholder="京A..." /></div>
                      <div className="space-y-1"><label className="text-xs font-medium text-gray-500">车辆型号</label><input className="form-input bg-white" placeholder="品牌型号" /></div>
                      <div className="space-y-1"><label className="text-xs font-medium text-gray-500">车辆类型</label>
                         <select className="form-input bg-white"><option>小型普通客车</option><option>大型货车</option><option>电动自行车</option></select>
                      </div>
                      <div className="space-y-1"><label className="text-xs font-medium text-gray-500">违法情形</label>
                         <select className="form-input bg-white text-orange-600 font-medium"><option>追尾</option><option>酒驾</option><option>闯红灯</option><option>逆行</option></select>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => setVehicles([...vehicles, { id: Date.now(), plate: '', type: '轿车', action: '' }])} 
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <Plus size={20} /> 添加车辆
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions & Summary */}
        <div className="w-full lg:w-96 flex flex-col gap-5">
          
          {/* AI Description Generator */}
          <div className="bg-white rounded-xl shadow-custom p-5 border border-gray-100 flex flex-col h-64">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <FileText size={16} className="text-primary"/> 事故详情描述
              </h3>
              <button onClick={generateDesc} className="text-xs flex items-center gap-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-2.5 py-1.5 rounded-md hover:from-blue-100 hover:to-blue-200 transition-all font-medium border border-blue-200">
                <Wand2 size={12} /> 一键生成
              </button>
            </div>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="flex-1 w-full bg-gray-50 rounded-lg border border-gray-200 p-3 text-sm resize-none focus:ring-1 focus:ring-primary focus:border-primary outline-none leading-relaxed text-gray-700"
              placeholder="点击上方按钮根据左侧信息自动生成，或手动输入..."
            />
          </div>

          {/* Core Drawing Action */}
          <div className="bg-gradient-to-br from-[#0c2d48] to-[#1a4b76] rounded-xl shadow-xl p-6 text-white relative overflow-hidden group border border-blue-900">
            {/* Visual Flair */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
            <div className="absolute bottom-0 right-0 opacity-10">
               <PenTool size={120} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">事故现场绘图</h3>
              <p className="text-blue-100 text-sm mb-6 max-w-[80%] leading-relaxed">
                进入专业绘图面板，支持实景导入、AI识别与国标图元绘制。
              </p>
              
              <button 
                onClick={() => navigate(`/editor/${id || 'new'}`)}
                className="w-full bg-white text-primary font-bold py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <PenTool size={18} />
                开始绘图
              </button>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex gap-2 items-start">
               <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
               <p className="text-xs text-yellow-800 leading-snug">
                 请确保所有必填项已录入。保存后信息将同步至云端。
               </p>
            </div>

            <div className="flex gap-3">
               <button onClick={() => navigate(-1)} className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium">
                 返回
               </button>
               <button className="flex-1 bg-primary text-white py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 font-bold active:scale-95">
                 <Save size={18} /> 保存信息
               </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const FormGroup = ({ label, icon: Icon, children, className }: any) => (
  <div className={cn("space-y-1.5", className)}>
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
      {Icon && <Icon size={14} className="text-primary" />}
      {label}
    </label>
    {React.cloneElement(children, {
      className: cn(children.props.className, "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-shadow placeholder:text-gray-400 font-medium text-gray-800")
    })}
  </div>
);

export default AccidentDetail;