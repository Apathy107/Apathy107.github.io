import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const A4_W = 210;
const A4_H = 297;

/**
 * 将勘查笔录表单容器（含三页）导出为符合模板样式的 PDF
 * 表单容器下应有带 data-record-page 的 3 个子页容器，或至少 3 个直接子元素
 */
export async function exportInvestigationToPdf(container: HTMLElement): Promise<void> {
  const pages = container.querySelectorAll<HTMLElement>('[data-record-page]');
  const pageElements =
    pages.length >= 3
      ? [pages[0], pages[1], pages[2]]
      : Array.from(container.children).slice(0, 3).filter((el): el is HTMLElement => el instanceof HTMLElement);

  if (pageElements.length === 0) {
    throw new Error('未找到笔录页内容');
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 0;

  for (let i = 0; i < pageElements.length; i++) {
    const el = pageElements[i];
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const imgW = canvas.width;
    const imgH = canvas.height;
    const ratio = Math.min(A4_W / (imgW / 2), A4_H / (imgH / 2));
    const w = (imgW / 2) * ratio;
    const h = (imgH / 2) * ratio;
    const x = (A4_W - w) / 2 + margin;
    const y = margin;

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', x, y, w, h);
  }

  const fileName = `道路交通事故现场勘查笔录_${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(fileName);
}
