import { addKeyword, EVENTS } from "@builderbot/bot";
import AIClass from "../services/ai";
import { clearHistory, getHistoryParse, handleHistory } from "../utils/handleHistory";
import { generateTimer } from "../utils/generateTimer";
import { getCurrentCalendar } from "../services/calendar";
import { getFullCurrentDate } from "src/utils/currentDate";
import { flowConfirm } from "./confirm.flow";
import { flowFirstStep } from "./firstStep.flow";
import { addMinutes, isWithinInterval, format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { ImageToText } from "src/utils/ImageToText";
import { Zzz } from "src/utils/Zzz";
import { provider } from "src/provider";



const flowSchedule = addKeyword(EVENTS.ACTION).addAction(async (ctx, { extensions, state, flowDynamic, endFlow, gotoFlow }) => {

    await flowDynamic('*Continuar* enviando o *apagar* chatbot?');
    
}).addAction({capture:true}, async (ctx,{gotoFlow, flowDynamic, state, endFlow}) => {
    const number = ctx.from;

    if (ctx.body.toLocaleLowerCase().includes('continuar')) {
        const remove = await Zzz(number, "POST", "remove");
        return gotoFlow(flowFirstStep)
    }

    if (ctx.body.toLocaleLowerCase().includes('apagar') || ctx.body.toLocaleLowerCase() === 'no') {
        const Blocked = await Zzz(number, "POST", "add");

        if (Blocked.added) {
            async function ejecutarEndFlow() {
                await clearHistory(state)
                return endFlow(`Chatbot desactivado`);
            }
             
            await ejecutarEndFlow();
        }
    }
    endFlow()    
})

export { flowSchedule }