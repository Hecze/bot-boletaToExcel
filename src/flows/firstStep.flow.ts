import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory, handleHistory } from "../utils/handleHistory";
import { flowImageToExcel } from "./imageToExcel.flow";
import { ImageToText } from "src/utils/ImageToText";
import { stringToExcel } from "src/utils/stringToExcel";
import path from 'path'
import fs from 'fs';
import { flowJustRead } from "./justRead.flow";




const flowFirstStep = addKeyword(EVENTS.MEDIA).addAction(async (ctx, { flowDynamic, state }) => {
        await clearHistory(state)
        const m = '¡Okay! Muestrame la foto'
        await flowDynamic(m)
        handleHistory({ content: m, role: "assistant" }, state);

}).addAction({ capture: true }, async (ctx, { provider, state, flowDynamic,  gotoFlow }) => {

    if (ctx.body.toLocaleLowerCase().includes('cancelar') || ctx.body.toLocaleLowerCase().includes('apagar') || ctx.body.toLocaleLowerCase().includes('salir')) {
        await clearHistory(state)
        await flowDynamic("Chatbot desactivado");
        await flowDynamic('Escriba *Encender* cuando desea activar el chatbot nuevamente')
        return gotoFlow(flowJustRead)
    }
    try {
        await flowDynamic("procesando...");
        const localPath = await provider.saveFile(ctx, { path: './src/cache/boletas' });
        console.log("imagen guardada en:" + localPath)
        const imagePath = localPath;
        const message = await ImageToText(imagePath);


        const excelFileName = await stringToExcel(message) || 'boleta.xlsx';


        const excelPathLocal = path.join(process.cwd(), 'src/cache/excel', excelFileName);
        //console.log("ruta del archivo excel: " +  excelPathLocal)

        try {

        await flowDynamic([{media: excelPathLocal}])
        //eliminar el archivo excel
        fs.unlinkSync(excelPathLocal);
        //elimnar la imagen
        fs.unlinkSync(imagePath);

        } catch (error) {
            console.log("Error al enviar el archivo: " + error)
        }

        return gotoFlow(flowImageToExcel)


    } catch (error) {
        console.log("firstStep: " + error)

    }


})


export { flowFirstStep }