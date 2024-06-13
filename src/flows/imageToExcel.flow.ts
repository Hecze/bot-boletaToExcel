import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory, getHistoryParse, handleHistory } from "../utils/handleHistory";
import { flowConfirm } from "./confirm.flow";
import { flowFirstStep } from "./firstStep.flow";
import { Zzz } from "src/utils/Zzz";



const flowImageToExcel = addKeyword(EVENTS.ACTION).addAction(async (ctx, { extensions, state, flowDynamic, endFlow, gotoFlow }) => {

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

export { flowImageToExcel }