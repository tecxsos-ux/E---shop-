
import { jsPDF } from 'jspdf';
import { Order, Settings } from '../types';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const generateInvoice = (order: Order, settings: Settings) => {
  const doc = new jsPDF();
  const primaryColor = settings.primaryColor || '#000000';

  // --- Header ---
  
  const logoSize = 25;
  const startX = 20;
  const startY = 15;

  // Brand Logo & Name
  if (settings.brandLogo) {
      try {
          doc.addImage(settings.brandLogo, 'PNG', startX, startY, logoSize, logoSize);
          
          // Brand Name next to logo
          doc.setFontSize(22);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(primaryColor);
          // Position text to the right of the logo, vertically centered relative to logo
          doc.text(settings.brandName, startX + logoSize + 5, startY + 16); 
      } catch (e) {
          // Fallback if image fails to load
          doc.setFontSize(24);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(primaryColor);
          doc.text(settings.brandName, startX, startY + 10);
      }
  } else {
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor);
      doc.text(settings.brandName, startX, startY + 10);
  }

  // Invoice Title (Top Right)
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("INVOICE", 190, startY + 10, { align: "right" });

  // Company Info - Start below logo area
  doc.setTextColor(100);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  // Calculate where to start company info. 
  // If logo exists, start below logo. If not, start below text.
  let infoY = startY + logoSize + 10;
  
  if (settings.companyName) {
      doc.text(settings.companyName, 20, infoY);
      infoY += 5;
  }
  if (settings.companyAddress) {
      const addressLines = doc.splitTextToSize(settings.companyAddress, 80);
      doc.text(addressLines, 20, infoY);
      infoY += (addressLines.length * 4);
  }
  if (settings.companyTaxId) {
      infoY += 1;
      doc.text(`Tax ID: ${settings.companyTaxId}`, 20, infoY);
      infoY += 5;
  }
  if (settings.companyEmail) {
      doc.text(`Email: ${settings.companyEmail}`, 20, infoY);
      infoY += 5;
  }
  if (settings.companyPhone) {
      doc.text(`Phone: ${settings.companyPhone}`, 20, infoY);
      infoY += 5;
  }

  // Divider Line
  infoY += 5;
  doc.setLineWidth(0.5);
  doc.setDrawColor(200);
  doc.line(20, infoY, 190, infoY);

  // --- Invoice Details ---
  let detailsY = infoY + 10;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50);
  
  // Left Column
  doc.text(`Invoice No:`, 20, detailsY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text(order.id, 50, detailsY);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50);
  doc.text(`Date:`, 20, detailsY + 5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text(new Date(order.date).toLocaleDateString(), 50, detailsY + 5);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(50);
  doc.text(`Status:`, 20, detailsY + 10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text(order.status, 50, detailsY + 10);

  // Right Column (Bill To)
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 120, detailsY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0);
  doc.text("Valued Customer", 120, detailsY + 5); 
  doc.text(order.shippingAddress.line1, 120, detailsY + 10);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 120, detailsY + 15);
  doc.text(order.shippingAddress.country, 120, detailsY + 20);

  // --- Table Header ---
  let tableY = detailsY + 35;
  
  doc.setFillColor(245, 247, 250);
  doc.rect(20, tableY - 5, 170, 8, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text("ITEM DESCRIPTION", 25, tableY);
  doc.text("QTY", 110, tableY);
  doc.text("UNIT PRICE", 130, tableY);
  doc.text("AMOUNT", 170, tableY, { align: "right" });
  
  tableY += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  // --- Items ---
  order.items.forEach((item) => {
    // Determine number of lines for item name
    const nameLines = doc.splitTextToSize(item.name, 80);
    
    doc.text(nameLines, 25, tableY);
    
    // Variant info logic
    let extraHeight = 0;
    if (item.selectedColor || item.selectedSize) {
        extraHeight = 4;
        doc.setFontSize(8);
        doc.setTextColor(100);
        let variantText = [];
        if(item.selectedColor) variantText.push(`Color: ${item.selectedColor}`);
        if(item.selectedSize) variantText.push(`Size: ${item.selectedSize}`);
        
        // Place variants below name (accounting for name lines)
        doc.text(variantText.join(" | "), 25, tableY + ((nameLines.length) * 4));
        doc.setFontSize(9);
        doc.setTextColor(0);
    }

    doc.text(item.quantity.toString(), 110, tableY);
    doc.text(formatCurrency(item.price), 130, tableY);
    doc.text(formatCurrency(item.price * item.quantity), 170, tableY, { align: "right" });
    
    // Calculate new Y position based on max height used in this row
    const rowHeight = Math.max((nameLines.length * 4) + extraHeight + 6, 10);
    tableY += rowHeight;
    
    // Add page if needed
    if (tableY > 270) {
        doc.addPage();
        tableY = 20;
    }
  });

  doc.setLineWidth(0.5);
  doc.setDrawColor(200);
  doc.line(20, tableY, 190, tableY);
  tableY += 5;

  // --- Totals ---
  const rightColX = 140;
  const valueColX = 190;
  
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", rightColX, tableY);
  doc.text(formatCurrency(order.subtotal || 0), valueColX, tableY, { align: "right" });
  
  tableY += 6;
  doc.text("Tax:", rightColX, tableY);
  doc.text(formatCurrency(order.tax || 0), valueColX, tableY, { align: "right" });
  
  tableY += 6;
  doc.text("Shipping:", rightColX, tableY);
  doc.text(formatCurrency(order.shippingCost || 0), valueColX, tableY, { align: "right" });

  tableY += 4;
  doc.setLineWidth(0.5);
  doc.line(130, tableY, 190, tableY);
  tableY += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  doc.text("Total:", rightColX, tableY);
  doc.text(formatCurrency(order.total), valueColX, tableY, { align: "right" });

  // --- Footer ---
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150);
  doc.text("Thank you for your business!", 105, 280, { align: "center" });
  doc.text(`${settings.companyName || settings.brandName} - ${settings.companyEmail || 'contact@luxemarket.ai'}`, 105, 285, { align: "center" });

  doc.save(`invoice_${order.id}.pdf`);
};
