import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ExportData {
  useCaseName: string;
  workflowName: string;
  prospects: number;
  emailsPerProspect: number;
  actions: Array<{
    action: string;
    credits_per_unit: number;
    description: string;
  }>;
  totalCredits: number;
  totalUsd: number;
  creditPerUsd: number;
  useCaseId: string;
}

export function exportQuote(data: ExportData) {
  const { 
    useCaseName, 
    workflowName, 
    prospects, 
    emailsPerProspect, 
    actions, 
    totalCredits, 
    totalUsd, 
    creditPerUsd,
    useCaseId 
  } = data;

  const getUnitLabels = (useCaseId: string) => {
    switch (useCaseId) {
      case 'ai-sdr':
        return { unit1: 'prospects', unit2: 'emails' };
      case 'ai-marketer':
        return { unit1: 'blog posts', unit2: 'social posts' };
      case 'ai-customer-service':
        return { unit1: 'tickets', unit2: 'follow-ups' };
      case 'ai-knowledge-search':
        return { unit1: 'searches', unit2: 'documents' };
      case 'ai-hr-support':
        return { unit1: 'queries', unit2: 'follow-ups' };
      default:
        return { unit1: 'units', unit2: 'actions' };
    }
  };

  const unitLabels = getUnitLabels(useCaseId);
  const totalActions = prospects * emailsPerProspect;
  const costPerProspect = totalUsd / prospects;
  const costPerAction = totalUsd / totalActions;
  const currentDate = new Date().toLocaleDateString();

  const calculateActionCredits = (action: any) => {
    let multiplier = prospects;
    if (action.action.toLowerCase().includes('email') || 
        action.action.toLowerCase().includes('follow-up') ||
        action.action.toLowerCase().includes('social media') ||
        action.action.toLowerCase().includes('query') ||
        action.action.toLowerCase().includes('response')) {
      multiplier = prospects * emailsPerProspect;
    }
    return action.credits_per_unit * multiplier;
  };

  // Create new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;

  // Colors
  const primaryColor = [0, 0, 0]; // Black
  const secondaryColor = [64, 64, 64]; // Dark gray
  const accentColor = [22, 163, 74]; // Green

  // Header with Logo area and title
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('LYZR AI', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Credits Calculator - Campaign Quote', 20, 33);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`Generated: ${currentDate}`, pageWidth - 20, 25, { align: 'right' });
  doc.text(`Quote ID: LYZ-${Date.now().toString().slice(-6)}`, pageWidth - 20, 33, { align: 'right' });

  yPosition = 55;

  // Campaign Overview Section
  doc.setTextColor(...primaryColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Campaign Overview', 20, yPosition);
  yPosition += 15;

  // Overview details in a nice box
  doc.setFillColor(248, 250, 252);
  doc.rect(20, yPosition - 5, pageWidth - 40, 35, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(20, yPosition - 5, pageWidth - 40, 35, 'S');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...secondaryColor);
  
  doc.text('Campaign Type:', 25, yPosition + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(`${useCaseName} - ${workflowName}`, 65, yPosition + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...secondaryColor);
  doc.text(`Target ${unitLabels.unit1}:`, 25, yPosition + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(prospects.toLocaleString(), 65, yPosition + 15);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...secondaryColor);
  doc.text(`${unitLabels.unit2} per ${unitLabels.unit1.slice(0, -1)}:`, 25, yPosition + 25);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(emailsPerProspect.toString(), 65, yPosition + 25);

  yPosition += 50;

  // Cost Breakdown Table
  doc.setTextColor(...primaryColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Cost Breakdown', 20, yPosition);
  yPosition += 10;

  // Prepare table data
  const tableData = actions.map(action => {
    const actionCredits = calculateActionCredits(action);
    const actionUsd = actionCredits * creditPerUsd;
    
    const multiplierText = action.action.toLowerCase().includes('email') || 
                          action.action.toLowerCase().includes('follow-up') ||
                          action.action.toLowerCase().includes('social media') ||
                          action.action.toLowerCase().includes('query') ||
                          action.action.toLowerCase().includes('response')
      ? `${prospects} × ${emailsPerProspect}`
      : prospects.toString();

    return [
      action.action,
      `${action.credits_per_unit} credits`,
      multiplierText,
      actionCredits.toLocaleString(),
      `$${actionUsd.toFixed(2)}`
    ];
  });

  // Add table
  doc.autoTable({
    startY: yPosition,
    head: [['Action', 'Rate', 'Volume', 'Total Credits', 'Cost (USD)']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [64, 64, 64]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    styles: {
      cellPadding: 5,
      lineColor: [226, 232, 240],
      lineWidth: 0.5
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Total Cost Summary Box
  doc.setFillColor(...accentColor);
  doc.rect(20, yPosition - 5, pageWidth - 40, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL CAMPAIGN COST', 25, yPosition + 8);

  doc.setFontSize(20);
  doc.text(`${totalCredits.toLocaleString()} credits`, 25, yPosition + 20);
  doc.setFontSize(16);
  doc.text(`$${totalUsd.toFixed(2)} USD`, pageWidth - 25, yPosition + 20, { align: 'right' });

  yPosition += 40;

  // Cost Per Unit Analysis
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Cost Analysis', 20, yPosition);
  yPosition += 15;

  doc.setFillColor(248, 250, 252);
  doc.rect(20, yPosition - 5, pageWidth - 40, 25, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(20, yPosition - 5, pageWidth - 40, 25, 'S');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...secondaryColor);
  
  doc.text(`Cost per ${unitLabels.unit1.slice(0, -1)}:`, 25, yPosition + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(`$${costPerProspect.toFixed(3)}`, 80, yPosition + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...secondaryColor);
  doc.text('Cost per action:', 25, yPosition + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(`$${costPerAction.toFixed(3)}`, 80, yPosition + 15);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...secondaryColor);
  doc.text('Credit rate:', pageWidth - 80, yPosition + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(`$${creditPerUsd} per credit`, pageWidth - 25, yPosition + 5, { align: 'right' });

  yPosition += 35;

  // Key Assumptions
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Assumptions & Notes', 20, yPosition);
  yPosition += 10;

  const assumptions = [
    `• Pricing based on ${creditPerUsd} USD per credit`,
    '• Campaign timeline: 2-3 weeks',
    '• Expected response rate: 15-25% (for sales campaigns)',
    '• Synthetic demo data - actual marketplace pricing may vary'
  ];

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...secondaryColor);
  
  assumptions.forEach(assumption => {
    doc.text(assumption, 25, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Next Steps
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Next Steps', 20, yPosition);
  yPosition += 10;

  const nextSteps = [
    '1. Review campaign parameters and adjust if needed',
    `2. Confirm budget allocation for ${totalCredits.toLocaleString()} credits`,
    '3. Set up campaign monitoring and success metrics',
    '4. Launch campaign with Lyzr AI automation'
  ];

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...secondaryColor);
  
  nextSteps.forEach(step => {
    doc.text(step, 25, yPosition);
    yPosition += 7;
  });

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
  
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text('Lyzr AI Credits Calculator Demo', 20, pageHeight - 20);
  doc.text('Visit: https://lyzr.ai', 20, pageHeight - 12);
  doc.text('For questions or support, contact your Lyzr AI representative', pageWidth - 20, pageHeight - 20, { align: 'right' });

  // Save the PDF
  const fileName = `lyzr-campaign-quote-${useCaseName.toLowerCase().replace(/\s+/g, '-')}-${currentDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}