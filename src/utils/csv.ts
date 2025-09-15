export type CsvRow = Record<string, string | number | boolean | null | undefined>;

const escapeCsvValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
};

export const toCsv = (rows: CsvRow[], headers?: string[]): string => {
  if (rows.length === 0) return '';
  const cols = headers ?? Object.keys(rows[0]);
  const lines = [cols.join(',')];
  for (const row of rows) {
    lines.push(cols.map((c) => escapeCsvValue(row[c])).join(','));
  }
  return lines.join('\n');
};

export const downloadCsv = (filename: string, csv: string): void => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};


