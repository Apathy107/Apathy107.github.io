import { 
  Plus, Minus, RefreshCcw, Maximize, MapPin, 
  Calendar, Camera, FileText
} from 'lucide-react';

export const StatusBar = ({ zoom, setZoom }: { zoom: number, setZoom: (z: number) => void }) => {
  return (
    <div className="h-8 bg-white border-t border-border flex items-center justify-between px-4 text-xs select-none z-20">
       <div className="flex items-center gap-4 text-gray-500 overflow-x-auto scrollbar-hide">
         <div className="flex items-center gap-1.5">
           <MapPin size={12} />
           <span>N 39°54′23″ E 116°23′45″</span>
         </div>
         <div className="w-px h-3 bg-gray-300" />
         <div className="flex items-center gap-1.5">
           <Camera size={12} />
           <span>HQ-Cam-01</span>
         </div>
         <div className="w-px h-3 bg-gray-300" />
         <div className="flex items-center gap-1.5">
           <Calendar size={12} />
           <span>2024-05-01 14:35:12</span>
         </div>
         <div className="w-px h-3 bg-gray-300" />
         <div className="flex items-center gap-1.5">
           <FileText size={12} />
           <span>20240501001</span>
         </div>
       </div>

       <div className="flex items-center gap-2 border-l border-border pl-4">
          <button title="适应窗口" className="p-1 hover:bg-gray-100 rounded text-gray-500"><Maximize size={12} /></button>
          <button title="重置视图" onClick={() => setZoom(100)} className="p-1 hover:bg-gray-100 rounded text-gray-500"><RefreshCcw size={12} /></button>
          
          <div className="flex items-center bg-gray-100 rounded ml-2">
            <button onClick={() => setZoom(Math.max(25, zoom - 25))} className="p-1 px-2 hover:bg-gray-200 rounded-l transition-colors"><Minus size={10} /></button>
            <span className="w-10 text-center font-mono text-gray-700">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-1 px-2 hover:bg-gray-200 rounded-r transition-colors"><Plus size={10} /></button>
          </div>
       </div>
    </div>
  );
};