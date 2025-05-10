import { Error, Log } from "../../utils/Logger.ts";

type Message = {
  timestamp: number;
  data: object;
}

export class ModuleBase {
  private messageHistory: Message[] = [];
  private messageHistoryItemLifetime: number = 600;
  public moduleName: string = "BaseModule";

  establishConnection() {
    Log(`Establishing connection to the module "${this.moduleName}"...`);
  }

  onDisconnect() {
    Error(`Module "${this.moduleName}" disconnected. Cleaning up resources...`);
  }

  onError(error: Error) {
    Error(`An error occurred in the module "${this.moduleName}": ${error.message}`);
  }

  onMessage(message: string) {
    Log(`Received message in module "${this.moduleName}": ${message}`);
  }

  // Message History Management
  addMessageToHistory(message: Message) {
    this.messageHistory.push(message);
    setTimeout(() => {
      this.removeMessageFromHistory(message);
    }, this.messageHistoryItemLifetime);
  }

  removeMessageFromHistory(message: Message) {
    const index = this.messageHistory.indexOf(message);
    if (index > -1) {
      this.messageHistory.splice(index, 1);
    }
  }

  getMessageHistory() {
    return this.messageHistory;
  }

  clearMessageHistory() {
    this.messageHistory = [];
  }

  getRecentMessages(count: number) {
    return this.messageHistory.slice(-count);
  }
}