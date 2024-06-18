import 'dotenv/config'
import { createBot, MemoryDB } from '@builderbot/bot'
import flow from './flows';
import { provider } from './provider';

const PORT = parseInt(process.env.PORT ?? '443', 10); // Conversión a número con base 10



const main = async () => {

  const bot = await createBot({
    flow,
    provider,
    database: new MemoryDB(),
  } );

  const { httpServer } = bot;

  httpServer(+PORT);
  console.log(`Bot server ready on port ${PORT}`);
}

main();
