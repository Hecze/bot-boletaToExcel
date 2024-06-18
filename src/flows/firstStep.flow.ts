import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory, handleHistory } from "../utils/handleHistory";
import { flowImageToExcel } from "./imageToExcel.flow";
import { ImageToText } from "src/utils/ImageToText";
import { stringToExcel } from "src/utils/stringToExcel";
import path from 'path'
import fs from 'fs';
import { flowJustRead } from "./justRead.flow";
import { fileURLToPath } from 'url';


const flowFirstStep = addKeyword(EVENTS.MEDIA).addAction(async (ctx, { flowDynamic, state }) => {
    await clearHistory(state)
    const m = '¡Okay! Muestrame la foto'
    await flowDynamic(m)
    handleHistory({ content: m, role: "assistant" }, state);

}).addAction({ capture: true }, async (ctx, { provider, state, flowDynamic, gotoFlow, fallBack }) => {

    if (ctx.body.toLocaleLowerCase().includes('cancelar') || ctx.body.toLocaleLowerCase().includes('apagar') || ctx.body.toLocaleLowerCase().includes('apagate') || ctx.body.toLocaleLowerCase().includes('salir')) {
        await clearHistory(state)
        await flowDynamic("Chatbot desactivado");
        await flowDynamic('Escriba *Encender* cuando desea activar el chatbot nuevamente')
        return gotoFlow(flowJustRead)
    }
    try {
        await flowDynamic("procesando...");
        // Obtener la ruta del directorio actual
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        // Especifica la ruta del directorio donde deseas guardar el archivo
        const directory = path.resolve(__dirname, '../cache/boletas');

        const localPath = await provider.saveFile(ctx, { path: directory });
        console.log("imagen guardada en:" + localPath)
        const imagePath = localPath;
        const message = await ImageToText(imagePath);


        const excelFile = await stringToExcel(message) || { directory: '', fileName: 'boleta.xlsx' };
        const excelFileDirectory = excelFile.directory;
        const excelFileName = excelFile.fileName;
        //console.log(`Directorio del archivo Excel: ${excelFileDirectory}`);
        //console.log(`Nombre del archivo Excel: ${excelFileName}`);


        const excelPathLocal = path.join(excelFileDirectory, excelFileName);
        console.log("ruta del archivo excel: " + excelPathLocal)

        try {
            //enviar el archivo con un delay de 2 segundos
            await new Promise(resolve => setTimeout(resolve, 2000));
            await flowDynamic([{ body: 'Excel File', media: excelPathLocal }])
            await provider.vendor.sendMessage(
                ctx.key.remoteJid,
                {
                    document: {
                        url: excelPathLocal
                    },
                    mimetype: 'application/xlsx',
                    fileName: 'myfile.xlsx'
                }
            )

            //eliminar el archivo excel
            fs.unlinkSync(excelPathLocal);
            //elimnar la imagen
            fs.unlinkSync(imagePath);



        } catch (error) {
            console.log("Error al enviar el archivo: " + error)
            await flowDynamic("Error al enviar el excel 😖");

        }


        return gotoFlow(flowImageToExcel)


    } catch (error) {
        console.log("firstStep: " + error)
        await flowDynamic("Error al procesar la imagen");
        return fallBack("vuelva a intentar");
    }
})


export { flowFirstStep }
