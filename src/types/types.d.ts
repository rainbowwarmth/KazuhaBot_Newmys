import { Browser } from "puppeteer";


declare global {
  var browser: Browser | null;
  var saveGuildsTree: SaveGuild[];

  interface SaveGuild {
    name: string,
    id: string,
    channel: SaveChannel[],
  }
  
  export interface SaveChannel {
    name: string,
    id: string,
  }
  
}
