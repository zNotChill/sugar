import { Error, Log } from "../../utils/Logger.ts";

export class ModuleBase {
  constructor() {
    Log("Module initialized and added to the main module list.");
  }

  establishConnection() {
    Log("Establishing connection to the module...");
  }

  onDisconnect() {
    Error("Module disconnected. Cleaning up resources...");
  }

  onError(error: Error) {
    Error("An error occurred in the module:", error.message);
  }

  onMessage(message: string) {
    Log("Received message in the module:", message);
  }
}