
import jsPDF from 'jspdf';

export const exportResponse = (content: string, feature: string, format: 'pdf' | 'json' | 'txt') => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${feature.toLowerCase().replace(/\s+/g, '_')}_${timestamp}`;

  switch (format) {
    case 'pdf':
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      pdf.setFontSize(16);
      pdf.text(feature, margin, 20);
      
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, 30);
      
      pdf.setFontSize(12);
      const lines = pdf.splitTextToSize(content, maxWidth);
      pdf.text(lines, margin, 45);
      
      pdf.save(`${filename}.pdf`);
      break;

    case 'json':
      const jsonData = {
        feature,
        content,
        timestamp: new Date().toISOString(),
        exported_by: 'Auralis'
      };
      
      const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { 
        type: 'application/json' 
      });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const jsonLink = document.createElement('a');
      jsonLink.href = jsonUrl;
      jsonLink.download = `${filename}.json`;
      jsonLink.click();
      URL.revokeObjectURL(jsonUrl);
      break;

    case 'txt':
      const txtContent = `${feature}\nGenerated on: ${new Date().toLocaleString()}\n\n${content}`;
      const txtBlob = new Blob([txtContent], { type: 'text/plain' });
      const txtUrl = URL.createObjectURL(txtBlob);
      const txtLink = document.createElement('a');
      txtLink.href = txtUrl;
      txtLink.download = `${filename}.txt`;
      txtLink.click();
      URL.revokeObjectURL(txtUrl);
      break;
  }
};
