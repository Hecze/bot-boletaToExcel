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
    const formattedDate = formatDate(now); // Formatear la fecha

    // Generar un identificador único (timestamp en milisegundos)
    const uniqueId = padNumber(now.getSeconds()) + padNumber(now.getMilliseconds());

    // Crear el nombre del archivo con la fecha actual y un identificador único
    const fileName = `texto extraido ${formattedDate} ${uniqueId}.xlsx`.replace(/[\\/:*?"<>|]/g, '-'); // Reemplazar caracteres inválidos

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
    const filePath = path.normalize(path.join(directory, fileName));

    // Verificar si el archivo ya existe antes de escribirlo
    if (fs.existsSync(filePath)) {
      console.log(`El archivo ${fileName} ya existe.`);
      // Puedes manejar esto de acuerdo a tus necesidades (renombre, aviso al usuario, etc.)
    } else {
      // Escribir el archivo XLSX solo si no existe previamente
      xlsx.writeFile(workbook, filePath);
      console.log(`Archivo ${fileName} creado exitosamente.`);
    }

    // Retornar el objeto ExcelFileDetails
    const excelFileDetails: ExcelFileDetails = {
      directory: directory,
      fileName: fileName
    };
    return excelFileDetails;

  } catch (error: any) {
    console.error("stringToExcel: " + error.message);
  }
}

// Función para formatear la fecha como 'YYYY-MM-DD hh:mm:ss.SSS am/pm'
function formatDate(date: Date): string {
  const day = padNumber(date.getDate());
  const month = padNumber(date.getMonth() + 1); // Los meses son de 0 a 11
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = padNumber(date.getMinutes());
  const seconds = padNumber(date.getSeconds());
  const milliseconds = padNumber(date.getMilliseconds());
  let period = 'am';

  if (hours >= 12) {
    period = 'pm';
    if (hours > 12) {
      hours -= 12;
    }
  }

  return `${year}-${month}-${day} ${padNumber(hours)}:${minutes}:${seconds}.${milliseconds} ${period}`;
}

// Función auxiliar para rellenar con ceros a la izquierda
function padNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

export { stringToExcel, ExcelFileDetails };
