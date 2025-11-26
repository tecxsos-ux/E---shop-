import { jsPDF } from 'jspdf';
import { Order } from '../types';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const generateInvoice = (order: Order) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("INVOICE", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Order ID: ${order.id}`, 20, 40);
  doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 20, 50);
  doc.text(`Status: ${order.status}`, 20, 60);

  doc.text("Bill To:", 140, 40);
  doc.text("Current User", 140, 50); // Mock user name
  doc.text(order.shippingAddress.line1, 140, 60);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 140, 70);

  let yPos = 90;
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("Item", 20, yPos);
  doc.text("Qty", 120, yPos);
  doc.text("Price", 160, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 10;
  doc.line(20, yPos - 5, 190, yPos - 5);

  order.items.forEach((item) => {
    doc.text(item.name, 20, yPos);
    doc.text(item.quantity.toString(), 120, yPos);
    doc.text(`$${item.price}`, 160, yPos);
    yPos += 10;
  });

  yPos += 10;
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  doc.setFont("helvetica", "bold");
  doc.text(`Total: $${order.total.toFixed(2)}`, 160, yPos);

  doc.save(`invoice_${order.id}.pdf`);
};