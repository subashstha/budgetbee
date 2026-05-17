import api from '../services/api';
import { formatDate, formatCurrency } from './formatters';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob instanceof Blob ? blob : new Blob([blob]));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const fetchAll = async () => {
  const res = await api.get('/transactions/export', { params: { format: 'json' } });
  return res.data.transactions;
};

const stamp = () => Date.now();

export const exportToCSV = async () => {
  const res = await api.get('/transactions/export', {
    params: { format: 'csv' },
    responseType: 'blob',
  });
  triggerDownload(res.data, `transactions-${stamp()}.csv`);
};

export const exportToExcel = async (currency) => {
  const transactions = await fetchAll();

  const data = transactions.map((t) => ({
    Date: formatDate(t.date),
    Title: t.title,
    Category: t.category,
    Type: t.type.charAt(0).toUpperCase() + t.type.slice(1),
    Amount: t.amount,
    Currency: currency,
    'Payment Method': t.paymentMethod || '',
    Notes: t.notes || '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [14, 30, 16, 12, 12, 8, 20, 24].map((w) => ({ wch: w }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
  XLSX.writeFile(wb, `transactions-${stamp()}.xlsx`);
};

export const exportToPDF = async (currency) => {
  const transactions = await fetchAll();

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Green header bar
  doc.setFillColor(5, 150, 105);
  doc.rect(0, 0, 297, 20, 'F');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('BudgetBee — Transaction Report', 14, 13);

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}  ·  ${transactions.length} transactions`,
    14, 28
  );

  autoTable(doc, {
    startY: 33,
    head: [['Date', 'Title', 'Category', 'Type', 'Amount', 'Payment Method', 'Notes']],
    body: transactions.map((t) => [
      formatDate(t.date),
      t.title,
      t.category,
      t.type.charAt(0).toUpperCase() + t.type.slice(1),
      formatCurrency(t.amount, currency),
      t.paymentMethod || '',
      t.notes || '',
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 253, 249] },
    columnStyles: {
      0: { cellWidth: 24 },
      1: { cellWidth: 55 },
      2: { cellWidth: 26 },
      3: { cellWidth: 18 },
      4: { cellWidth: 28 },
      5: { cellWidth: 28 },
    },
  });

  doc.save(`transactions-${stamp()}.pdf`);
};

export const exportToPNG = async (tableRef) => {
  const canvas = await html2canvas(tableRef, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  });
  canvas.toBlob((blob) => triggerDownload(blob, `transactions-${stamp()}.png`), 'image/png');
};
