import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory, handleHistory } from "../utils/handleHistory";
import { flowImageToExcel } from "./imageToExcel.flow";
import { ImageToText } from "src/utils/ImageToText";
import { stringToExcel } from "src/utils/stringToExcel";
import path from 'path'
import fs from 'fs';




const DURATION_MEET = process.env.DURATION_MEET ?? 45
/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowFirstStep = addKeyword(EVENTS.MEDIA).addAction(async (ctx, { flowDynamic, gotoFlow, endFlow, state }) => {
    await clearHistory(state)
    const m = '¡Okay! Muestrame la foto'
    await flowDynamic(m)
    handleHistory({ content: m, role: "assistant" }, state);
}).addAction({ capture: true }, async (ctx, { provider, state, flowDynamic, endFlow, gotoFlow }) => {

    if (ctx.body.toLocaleLowerCase().includes('cancelar') || ctx.body.toLocaleLowerCase().includes('apagar') || ctx.body.toLocaleLowerCase().includes('salir')) {
        await clearHistory(state)
        return endFlow(`chatbot apagado`)
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