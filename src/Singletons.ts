import { Core } from "./Core.ts";
import { EventHandler } from "./modules/events/EventHandler.ts";

export const core = new Core();
export const eventHandler = new EventHandler();