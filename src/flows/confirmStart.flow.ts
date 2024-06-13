import { addKeyword, EVENTS } from "@builderbot/bot";
import { flowFirstStep } from "./firstStep.flow";
import { Zzz } from "../utils/Zzz";

const DURATION_MEET = process.env.DURATION_MEET ?? 45
/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowConfirmStart = addKeyword(EVENTS.ACTION).addAction(async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
    const number = ctx.from;
    const Veryfied = await Zzz(number, "POST", "check");
    if (!Veryfied.isBlacklisted) {
        await flowDynamic('Hola, ¿Deseas insertar la imagen de tu boleta?');
        await flowDynamic('*Insertar* o *Apagar* chatbot');
    }

}).addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow, gotoFlow }) => {
    const number = ctx.from;

    if (ctx.body.toLocaleLowerCase().includes('insertar') || ctx.body.toLocaleLowerCase().includes('encender') || ctx.body.toLocaleLowerCase().includes('activar')) {
        const remove = await Zzz(number, "POST", "remove");
        return gotoFlow(flowFirstStep)
    }

    if (ctx.body.toLocaleLowerCase().includes('apagar') || ctx.body.toLocaleLowerCase() === 'no') {
        const Blocked = await Zzz(number, "POST", "add");

        if (Blocked.added) endFlow(`Chatbot desactivado`);
    }

})


export { flowConfirmStart }