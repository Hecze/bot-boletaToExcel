import { BotContext, BotMethods } from "@builderbot/bot/dist/types"
import { flowConfirmStart } from "../flows/confirmStart.flow"


export default async(_: BotContext, { state, gotoFlow, extensions }: BotMethods) => {

    return gotoFlow(flowConfirmStart)

}