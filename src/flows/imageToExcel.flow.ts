import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory, getHistoryParse, handleHistory } from "../utils/handleHistory";
import { flowFirstStep } from "./firstStep.flow";
import { flowJustRead } from "./justRead.flow";



const flowImageToExcel = addKeyword(EVENTS.ACTION).addAction(async (ctx, { extensions, state, flowDynamic, endFlow, gotoFlow }) => {

    await flowDynamic('*Continuar* enviando o *apagar* chatbot?');

}).addAction({ capture: true }, async (ctx, { gotoFlow, flowDynamic, state, endFlow }) => {
    const number = ctx.from;

    if (ctx.body.toLocaleLowerCase().includes('continuar')) {
        return gotoFlow(flowFirstStep)
    }

    if (ctx.body.toLocaleLowerCase().includes('apagar') || ctx.body.toLocaleLowerCase() === 'no') {
        await flowDynamic('Chatbot apagado')
        await clearHistory(state)
        return gotoFlow(flowJustRead)
    }

    endFlow()
})

export { flowImageToExcel }