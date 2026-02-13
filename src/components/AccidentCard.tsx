import { Calendar, MapPin, AlertTriangle, ChevronRight, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccidentCardProps {
  data: {
    id: string;
    code: string;
    name: string;
    time: string;
    location: string;
    status: string; // 'waiting', 'process', 'completed'
    image: string;
  }
}

const AccidentCard = ({ data }: AccidentCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'process': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed': return '已完成';
      case 'process': return '绘图中';
      default: return '草稿';
    }
  };

  return (
    <div 
      onClick={() => navigate('/accident/detail')}
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-custom transition-all duration-300 cursor-pointer group"
    >
      <div className="flex flex-row h-32 md:h-40">
        {/* Image Section */}
        <div className="w-1/3 md:w-48 relative overflow-hidden bg-gray-100">
          <img 
            src={data.image} 
            alt="accident" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/50 text-white backdrop-blur-sm">
            {data.code}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-base md:text-lg line-clamp-1">{data.name}</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] md:text-xs font-medium border ${getStatusColor(data.status)}`}>
                {getStatusText(data.status)}
              </span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                <Calendar size={14} className="mr-1.5 shrink-0" />
                <span>{data.time}</span>
              </div>
              <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                <MapPin size={14} className="mr-1.5 shrink-0" />
                <span className="line-clamp-1">{data.location}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button className="text-primary text-xs md:text-sm font-medium flex items-center hover:underline">
              查看详情 <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccidentCard;