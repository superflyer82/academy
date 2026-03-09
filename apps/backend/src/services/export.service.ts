import { prisma } from '../lib/prisma';
import Papa from 'papaparse';
import ExcelJS from 'exceljs';

async function getReportsData() {
  const reports = await prisma.report.findMany({
    include: { category: true, assignedTo: true },
    orderBy: { createdAt: 'desc' },
  });
  return reports.map((r) => ({
    ID: r.id,
    Erstellt: r.createdAt.toISOString(),
    Status: r.status,
    Priorität: r.priority,
    Kategorie: r.category.name,
    Beschreibung: r.description ?? '',
    Adresse: r.address ?? '',
    Breitengrad: r.lat,
    Längengrad: r.lng,
    'Melder Name': r.reporterName ?? 'Anonym',
    'Melder E-Mail': r.reporterEmail ?? '',
    Zugewiesen: r.assignedTo?.name ?? '',
  }));
}

export async function exportCsv(): Promise<string> {
  const data = await getReportsData();
  return Papa.unparse(data, { header: true, delimiter: ';' });
}

export async function exportXlsx(): Promise<Buffer> {
  const data = await getReportsData();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Meldungen');

  if (data.length > 0) {
    sheet.columns = Object.keys(data[0]).map((key) => ({ header: key, key, width: 20 }));
    sheet.addRows(data);
    sheet.getRow(1).font = { bold: true };
  }

  return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
}
