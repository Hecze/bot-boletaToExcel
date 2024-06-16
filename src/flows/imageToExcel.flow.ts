import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory } from "../utils/handleHistory";
import { flowFirstStep } from "./firstStep.flow";
import { flowJustRead } from "./justRead.flow";



const flowImageToExcel = addKeyword(EVENTS.ACTION).addAction(async (ctx, {  flowDynamic}) => {

    await flowDynamic('*Continuar* enviando o *apagar* chatbot?');

}).addAction({ capture: true }, async (ctx, { gotoFlow, flowDynamic, state, endFlow }) => {

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