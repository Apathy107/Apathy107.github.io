import { useState, useCallback } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ElementLibrary } from '@/components/diagram/ElementLibrary';
import { EditorToolbar } from '@/components/diagram/EditorToolbar';
import { RightPanel } from '@/components/diagram/RightPanel';
import { StatusBar } from '@/components/diagram/StatusBar';
import { SignatureModal } from '@/components/diagram/SignatureModal';

const DiagramEditor = () => {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState('select');
  const [showRealImage, setShowRealImage] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [showExport, setShowExport] = useState(false);
  const [elements, setElements] = useState<any[]>([]);

  // Simulation of adding elements
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Logic to add element at cursor position
  };

  const handleAction = useCallback((action: string) => {
    switch(action) {
      case 'export':
        setShowExport(true);
        break;
      case 'clear':
        if(confirm('确定要清空画布吗?')) setElements([]);
        break;
      case 'toggleImage':
        setShowRealImage(prev => !prev);
        break;
      case 'recognize':
        alert('正在识别实景图中的道路要素... \n识别到：车道线 x2, 车辆 x2');
        break;
      case 'save':
        // simulate save
        alert('保存成功');
        break;
      default:
        console.log('Action:', action);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col h-screen overflow-hidden">
      {/* 1. Header Navigation (Different from Toolbar, mostly for Back) */}
      <div className="h-10 bg-primary text-primary-foreground flex items-center justify-between px-4 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-medium">事故绘图 - 20240501001</span>
        </div>
        <div className="text-xs opacity-80">
          自动保存于 14:35
        </div>
      </div>

      {/* 2. Main Editor Toolbar */}
      <EditorToolbar 
        activeTool={activeTool} 
        onToolChange={setActiveTool} 
        onAction={handleAction}
        showRealImage={showRealImage}
      />

      {/* 3. Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* 3.1 Left Sidebar: Element Library */}
        <ElementLibrary />

        {/* 3.2 Center Canvas */}
        <div className="flex-1 relative bg-[#e5e5e5] overflow-hidden flex flex-col">
          <div 
            className="flex-1 relative overflow-auto p-8 flex items-center justify-center custom-scrollbar"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {/* The Canvas */}
            <div 
               className="bg-white shadow-xl relative transition-transform duration-200 ease-out origin-center"
               style={{ 
                 width: '800px', 
                 height: '600px', 
                 transform: `scale(${zoom / 100})`,
               }}
            >
               {/* Background Layer (Real Image) */}
               {showRealImage && (
                 <div className="absolute inset-0 z-0">
                    <img 
                      src="https://images.unsplash.com/photo-1599321454546-aa443831818d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                      className="w-full h-full object-cover opacity-60 pointer-events-none select-none"
                      alt="Base Map"
                    />
                    {/* Simulated Recognized Elements Overlay */}
                    <div className="absolute inset-0 pointer-events-none border-4 border-blue-500/20"></div>
                 </div>
               )}

               {/* Grid Layer */}
               <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

               {/* Elements Layer */}
               <div className="absolute top-1/3 left-1/3 w-20 h-40 bg-blue-500/30 border-2 border-blue-600 rounded flex items-center justify-center z-10 cursor-move hover:bg-blue-500/40" title="可拖拽车辆">
                  <span className="text-xs font-bold text-blue-800 -rotate-90 whitespace-nowrap">京A·XX234</span>
                  {/* Resize Handles */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-blue-600"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-blue-600"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-blue-600"></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-blue-600"></div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-blue-600 origin-bottom">
                    <div className="w-2 h-2 rounded-full bg-blue-600 absolute -top-1 -left-[3px]"></div>
                  </div>
               </div>
               
               {/* Measurement Line Simulation */}
               <div className="absolute top-[40%] left-[40%] w-40 h-0.5 bg-red-500 z-20 flex items-center justify-center">
                  <span className="bg-red-500 text-white text-[10px] px-1 rounded-sm -mt-4">3.5m</span>
                  <div className="absolute left-0 w-2 h-2 bg-red-500 rounded-full -mt-[3px]"></div>
                  <div className="absolute right-0 w-2 h-2 bg-red-500 rounded-full -mt-[3px]"></div>
               </div>

               {/* Empty State / Dropzone Hint */}
               {elements.length === 0 && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                   <div className="p-4 bg-black/5 rounded-lg border-2 border-dashed border-black/10 text-gray-400 text-sm flex flex-col items-center">
                     <Plus size={24} className="mb-2 opacity-50" />
                     从左侧拖入图元或点击"一键识别"
                   </div>
                 </div>
               )}
            </div>
          </div>

          <StatusBar zoom={zoom} setZoom={setZoom} />
        </div>

        {/* 3.3 Right Sidebar: Control Panel */}
        <RightPanel />
      </div>

      {/* 4. Modals */}
      <SignatureModal 
        isOpen={showExport} 
        onClose={() => setShowExport(false)}
        onConfirm={() => {
          setShowExport(false);
          alert('导出并归档成功！');
        }}
      />
    </div>
  );
};

export default DiagramEditor;