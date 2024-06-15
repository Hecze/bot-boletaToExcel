import { createFlow } from "@builderbot/bot";
import { welcomeFlow } from "./welcome.flow";
import { flowImageToExcel } from "./imageToExcel.flow";
import { flowConfirmStart } from "./confirmStart.flow";
import { flowFirstStep } from "./firstStep.flow";
import { flowJustRead } from "./justRead.flow";


export default createFlow([welcomeFlow, flowImageToExcel, flowConfirmStart, flowFirstStep, flowJustRead])