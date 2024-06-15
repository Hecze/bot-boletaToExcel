import { addKeyword, EVENTS } from "@builderbot/bot";
import { flowFirstStep } from "./firstStep.flow";
import { flowJustRead } from "./justRead.flow";

const DURATION_MEET = process.env.DURATION_MEET ?? 45
/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowConfirmStart = addKeyword(EVENTS.ACTION).addAction(async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
    const number = ctx.from;
    await flowDynamic('Hola, ¿Deseas insertar la imagen de tu boleta?');
    await flowDynamic('*Insertar* o *Apagar* chatbot');

}).addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow, gotoFlow }) => {
    const number = ctx.from;

    if (ctx.body.toLocaleLowerCase().includes('apagar') || ctx.body.toLocaleLowerCase() === 'no') {
        await flowDynamic('Chatbot apagado')
        await flowDynamic('Escriba *Encender* cuando desea activar el chatbot nuevamente')
        return gotoFlow(flowJustRead)
    }

    if (ctx.body.toLocaleLowerCase().includes('insertar') || ctx.body.toLocaleLowerCase().includes('encender') || ctx.body.toLocaleLowerCase().includes('activar')) {
        return gotoFlow(flowFirstStep)
    }
})


export { flowConfirmStart }