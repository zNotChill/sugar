import { DiscordBotModule } from "./discordbot/Bot.ts";
import { HandspeedModule } from "./handspeed/Handspeed.ts";
import { TosuModule } from "./tosu/Tosu.ts";

export const modules = [
  new TosuModule(),
  new HandspeedModule(),
  new DiscordBotModule()
]

export class ModuleCore {
  static getModuleByName(name: string) {
    const module = modules.find((mod) => mod.moduleName === name);
    if (!module) {
      throw new Error(`Module ${name} not found`);
    }
    return module;
  }
}