import * as csvWriterFactory from 'csv-writer';
import * as csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';

const DIRECTORY_OUTPUT = path.join(process.cwd(), 'temp', 'output');
const DIRECTORY_INPUT = path.join(process.cwd(), 'temp', 'input');

interface CSVHeader {
  id: string;
  title: string;
}

interface CSVResponse<TResponse> {
  header: CSVHeader[];
  data: TResponse[];
}

try {
  fs.mkdirSync(DIRECTORY_OUTPUT);
} catch (e) {}

export async function readStore<RAWCSV>(
  fileName: string,
  isProcessed = false
): Promise<RAWCSV[]> {
  const filePath = path.join(
    isProcessed ? DIRECTORY_OUTPUT + '/raw' : DIRECTORY_INPUT,
    fileName
  );
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const data = [];

  return new Promise(function (resolve, reject) {
    fs.createReadStream(filePath)
      .pipe(csvParser.default())
      .on('error', (error) => reject(error))
      .on('data', (row) => data.push(row))
      .on('end', () => {
        resolve(data);
      });
  });
}

export async function writeStore<TResponse>(
  fileName: string,
  type: 'raw' | 'processed',
  data: CSVResponse<TResponse>
): Promise<void> {
  const tempPath = path.join(DIRECTORY_OUTPUT, type);
  const filePath = path.join(tempPath, fileName);

  try {
    fs.mkdirSync(tempPath);
  } catch (e) {}

  const csvWriter = csvWriterFactory.createObjectCsvWriter({
    path: filePath,
    header: data.header,
  });
  await csvWriter.writeRecords(data.data);
}
