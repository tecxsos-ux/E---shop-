
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

  // --- Header ---
  
  // Brand Name or Logo
  if (settings.brandLogo) {
      try {
          doc.addImage(settings.brandLogo, 'PNG', 20, 15, 30, 0); // Keep aspect ratio roughly
      } catch (e) {
          // Fallback if image fails to load or format issues
          doc.setFontSize(24);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(settings.primaryColor);
          doc.text(settings.brandName, 20, 25);
      }
  } else {
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(settings.primaryColor);
      doc.text(settings.brandName, 20, 25);
  }

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("INVOICE", 150, 25, { align: "right" });

  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);

  // --- Invoice Details ---
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  // Left Column
  doc.text(`Invoice No:`, 20, 50);
  doc.setFont("helvetica", "bold");
  doc.text(order.id, 50, 50);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Date:`, 20, 55);
  doc.setFont("helvetica", "bold");
  doc.text(new Date(order.date).toLocaleDateString(), 50, 55);

  doc.setFont("helvetica", "normal");
  doc.text(`Status:`, 20, 60);
  doc.setFont("helvetica", "bold");
  doc.text(order.status, 50, 60);

  // Right Column (Bill To)
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 120, 50);
  doc.setFont("helvetica", "normal");
  // Assuming a generic customer name if not explicit, but usually passed via order in a real app
  doc.text("Valued Customer", 120, 55); 
  doc.text(order.shippingAddress.line1, 120, 60);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 120, 65);
  doc.text(order.shippingAddress.country, 120, 70);

  // --- Table Header ---
  let yPos = 85;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos - 5, 170, 8, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("ITEM DESCRIPTION", 25, yPos);
  doc.text("QTY", 110, yPos);
  doc.text("UNIT PRICE", 130, yPos);
  doc.text("AMOUNT", 170, yPos, { align: "right" });
  
  yPos += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  // --- Items ---
  order.items.forEach((item) => {
    doc.text(item.name, 25, yPos);
    // Variant info
    if (item.selectedColor || item.selectedSize) {
        yPos += 4;
        doc.setFontSize(8);
        doc.setTextColor(100);
        let variantText = [];
        if(item.selectedColor) variantText.push(`Color: ${item.selectedColor}`);
        if(item.selectedSize) variantText.push(`Size: ${item.selectedSize}`);
        doc.text(variantText.join(" | "), 25, yPos);
        doc.setFontSize(9);
        doc.setTextColor(0);
        yPos -= 4; // Reset for line height
    }

    doc.text(item.quantity.toString(), 110, yPos);
    doc.text(`$${item.price.toFixed(2)}`, 130, yPos);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, yPos, { align: "right" });
    
    yPos += 10;
    
    // Add page if needed
    if (yPos > 270) {
        doc.addPage();
        yPos = 20;
    }
  });

  doc.line(20, yPos, 190, yPos);
  yPos += 5;

  // --- Totals ---
  const rightColX = 140;
  const valueColX = 170;
  
  doc.text("Subtotal:", rightColX, yPos);
  doc.text(`$${(order.subtotal || 0).toFixed(2)}`, valueColX, yPos, { align: "right" });
  
  yPos += 6;
  doc.text("Tax:", rightColX, yPos);
  doc.text(`$${(order.tax || 0).toFixed(2)}`, valueColX, yPos, { align: "right" });
  
  yPos += 6;
  doc.text("Shipping:", rightColX, yPos);
  doc.text(`$${(order.shippingCost || 0).toFixed(2)}`, valueColX, yPos, { align: "right" });

  yPos += 4;
  doc.setLineWidth(0.5);
  doc.line(130, yPos, 190, yPos);
  yPos += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total:", rightColX, yPos);
  doc.text(`$${order.total.toFixed(2)}`, valueColX, yPos, { align: "right" });

  // --- Footer ---
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150);
  doc.text("Thank you for your business!", 105, 280, { align: "center" });
  doc.text(`${settings.brandName} - Contact us at support@luxemarket.ai`, 105, 285, { align: "center" });

  doc.save(`invoice_${order.id}.pdf`);
};
