import fs from 'fs';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

interface ExcelFileDetails {
  directory: string;
  fileName: string;
}

async function stringToExcel(message: string): Promise<ExcelFileDetails | void> {
  try {
    // Crear un nuevo libro de trabajo
    const workbook = xlsx.utils.book_new();

    // Crear una nueva hoja de trabajo
    const worksheet = xlsx.utils.aoa_to_sheet([[message]]);

    // Añadir la hoja de trabajo al libro de trabajo
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Obtener la fecha actual en el formato deseado
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-T:.Z]/g, '').slice(0, 15);

    // Crear el nombre del archivo con la fecha actual
    const fileName = `message_${formattedDate}.xlsx`;

    // Obtener la ruta del directorio actual
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Especifica la ruta del directorio donde deseas guardar el archivo
    const directory = path.resolve(__dirname, '../cache/excel');

    // Asegúrate de que el directorio exista
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Crear el nombre completo del archivo con la ruta
    const filePath = path.join(directory, fileName);

    // Escribir el archivo XLSX
    xlsx.writeFile(workbook, filePath);
    console.log(`Archivo ${fileName} creado exitosamente.`);
    return { directory, fileName };

  } catch (error: any) { // Especificar que el error es de tipo `any`
    console.error("stringToExcel: " + error.message);
  }
}

export { stringToExcel, ExcelFileDetails };
