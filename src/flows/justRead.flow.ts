import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory, handleHistory } from "../utils/handleHistory";
import { flowImageToExcel } from "./imageToExcel.flow";
import { ImageToText } from "src/utils/ImageToText";
import { stringToExcel } from "src/utils/stringToExcel";
import path from 'path'
import fs from 'fs';
import { flowConfirmStart } from "./confirmStart.flow";




const DURATION_MEET = process.env.DURATION_MEET ?? 45
/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowJustRead = addKeyword(EVENTS.ACTION).addAction(async (ctx, { flowDynamic, gotoFlow, endFlow, state }) => {

}).addAction({ capture: true }, async (ctx, { provider, state, flowDynamic, endFlow, gotoFlow }) => {
    const number = ctx.from;
    if (ctx.body.toLocaleLowerCase().includes('insertar') || ctx.body.toLocaleLowerCase().includes('encender') || ctx.body.toLocaleLowerCase().includes('activar')) {
        console.log("el usuario intenta activar el chatbot")
        return endFlow(`Chatbot activado`);
    }

    return gotoFlow(flowJustRead)




})


export { flowJustRead }