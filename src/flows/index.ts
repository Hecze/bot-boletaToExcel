import { createFlow } from "@builderbot/bot";
import { welcomeFlow } from "./welcome.flow";
import { flowImageToExcel } from "./imageToExcel.flow";
import { flowConfirm } from "./confirm.flow";
import { flowConfirmStart } from "./confirmStart.flow";
import { flowFirstStep } from "./firstStep.flow";


export default createFlow([welcomeFlow, flowImageToExcel, flowConfirm, flowConfirmStart, flowFirstStep])