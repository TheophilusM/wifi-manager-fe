export function extractExcelDate(excelDateValue) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysSinceExcelEpoch = excelDateValue - 25569;
  const millisecondsSinceExcelEpoch = daysSinceExcelEpoch * millisecondsPerDay;
  const jsDate = new Date(millisecondsSinceExcelEpoch);
  return jsDate;
}