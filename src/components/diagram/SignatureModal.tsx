import { X, PenTool, Check, Eraser, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

export type SignatureModalMode = 'diagram' | 'record';

const RECORD_SIGNATORY_ROLES = ['现场勘查人员', '记录人', '当事人', '见证人'] as const;
const DIAGRAM_SIGNATORY_ROLES = ['勘察员', '绘图员', '当事人A', '当事人B', '见证人'] as const;

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** 笔录模式：显示笔录预览 + 四类签字人 */
  mode?: SignatureModalMode;
  /** 笔录总页数（仅 record 模式） */
  totalPages?: number;
  /** 用于克隆的笔录表单容器 ref（仅 record 模式，克隆后做分页预览） */
  recordPreviewSourceRef?: React.RefObject<HTMLDivElement | null>;
}

export const SignatureModal = ({
  isOpen,
  onClose,
  onConfirm,
  mode = 'diagram',
  totalPages = 3,
  recordPreviewSourceRef,
}: SignatureModalProps) => {
  const isRecord = mode === 'record';
  const roles = isRecord ? RECORD_SIGNATORY_ROLES : DIAGRAM_SIGNATORY_ROLES;
  const [activeRole, setActiveRole] = useState<string>(roles[0]);
  const [previewPage, setPreviewPage] = useState(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveRole(roles[0]);
  }, [mode]);

  // 笔录模式：克隆表单 DOM 到预览区，并支持按页滚动
  useEffect(() => {
    if (!isOpen || !isRecord || !recordPreviewSourceRef?.current || !previewContainerRef?.current) return;
    const source = recordPreviewSourceRef.current;
    const container = previewContainerRef.current;
    container.innerHTML = '';
    const clone = source.cloneNode(true) as HTMLDivElement;
    clone.querySelectorAll('input, select, textarea, button').forEach((el) => {
      (el as HTMLInputElement).disabled = true;
      (el as HTMLElement).style.pointerEvents = 'none';
    });
    container.appendChild(clone);
  }, [isOpen, isRecord, recordPreviewSourceRef]);

  useEffect(() => {
    if (!isOpen || !isRecord || !previewContainerRef?.current) return;
    const pageEl = previewContainerRef.current.querySelector(`[data-record-page="${previewPage}"]`);
    if (pageEl) pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [isOpen, isRecord, previewPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-gray-50">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <PenTool size={18} className="text-primary" />
            {isRecord ? '笔录签署归档' : '笔录文件 - 签字确认'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* 左侧：笔录文件预览（分页翻页） */}
          <div className="w-1/2 flex flex-col border-r border-border bg-gray-100">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-white">
              <span className="text-sm font-bold text-gray-600">笔录文件预览</span>
              {isRecord && totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                    disabled={previewPage <= 1}
                    className="p-1.5 rounded border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm text-gray-600 min-w-[80px] text-center">
                    第 {previewPage} / {totalPages} 页
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewPage((p) => Math.min(totalPages, p + 1))}
                    disabled={previewPage >= totalPages}
                    className="p-1.5 rounded border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {isRecord && recordPreviewSourceRef?.current ? (
                <div
                  ref={previewContainerRef}
                  className="bg-white shadow-sm rounded border border-gray-200 overflow-hidden [&_button]:!hidden"
                  style={{ minHeight: '400px' }}
                />
              ) : isRecord ? (
                <div className="bg-white p-6 rounded border border-gray-200 text-center text-gray-400 text-sm">
                  请关闭后重新打开，以加载笔录预览
                </div>
              ) : (
                <div className="bg-white p-2 shadow-sm rounded border border-gray-200 aspect-[3/4] flex items-center justify-center">
                  <div className="text-center text-gray-300">
                    <span className="block text-4xl mb-2">📄</span>
                    笔录文件预览区域
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：签字人切换 + 签名区 */}
          <div className="w-1/2 flex flex-col bg-white">
            <div className="flex bg-gray-50 border-b border-border">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveRole(role)}
                  className={cn(
                    'flex-1 py-3 text-sm font-medium border-b-2 transition-colors',
                    activeRole === role ? 'border-primary text-primary bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="flex-1 p-6 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">请在下方区域签名：</span>
                <button type="button" className="text-xs flex items-center gap-1 text-gray-500 hover:text-red-500">
                  <Eraser size={12} /> 清除
                </button>
              </div>
              <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-50/50 transition-colors cursor-crosshair relative min-h-[200px]">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-5xl text-gray-200 opacity-50 font-handwriting">
                    {activeRole} 签名区
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>日期：{new Date().toLocaleDateString('zh-CN')}</span>
                <span>IP：—</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-16 border-t border-border flex items-center justify-end px-6 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Check size={16} />
            确认并归档
          </button>
        </div>
      </div>
    </div>
  );
};
