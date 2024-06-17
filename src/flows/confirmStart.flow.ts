import { addKeyword, EVENTS } from "@builderbot/bot";
import { flowFirstStep } from "./firstStep.flow";
import { flowJustRead } from "./justRead.flow";


const flowConfirmStart = addKeyword(EVENTS.ACTION).addAction(async (ctx, { flowDynamic}) => {
    await flowDynamic('Hola, ¿Deseas insertar la imagen de tu boleta?');
    await flowDynamic('*Insertar* o *Apagar* chatbot');

}).addAction({ capture: true }, async (ctx, { flowDynamic, gotoFlow, fallBack }) => {

    if (ctx.body.toLocaleLowerCase().includes('apagar') || ctx.body.toLocaleLowerCase().includes('apagate') || ctx.body.toLocaleLowerCase() === 'no') {
        await flowDynamic('Chatbot apagado')
        await flowDynamic('Escriba *Encender* cuando desea activar el chatbot nuevamente')
        return gotoFlow(flowJustRead)
    }

    if (ctx.body.toLocaleLowerCase().includes('insertar') || ctx.body.toLocaleLowerCase().includes('encender') || ctx.body.toLocaleLowerCase().includes('activar')) {
        return gotoFlow(flowFirstStep)
    }

    return fallBack("🤔")
})


export { flowConfirmStart }