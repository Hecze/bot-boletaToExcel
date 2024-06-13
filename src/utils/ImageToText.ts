import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from "axios";
import { createWorker } from 'tesseract.js';

async function ImageToText(img: string) {
  const worker = await createWorker('eng');
  
    try {
      const ret = await worker.recognize(img);
      //console.log(ret.data.text);
      await worker.terminate();
      return ret.data.text
      }
  
    catch (error) {
      console.error("Request error:", error.message);
    }
  }

export { ImageToText };
