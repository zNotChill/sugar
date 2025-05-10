// deno-lint-ignore-file
import { Events } from "./types/Events.ts";

export class EventHandler {
  private listeners: { [key in Events]?: ((...args: any[]) => void)[] } = {};

  constructor() {
    this.listeners = {};
  }

  public on(event: Events, callback: (...args: any[]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(callback);
  }

  public off(event: Events, callback: (...args: any[]) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]?.filter((cb) => cb !== callback);
  }

  public emit(event: Events, ...args: any[]) {
    if (!this.listeners[event]) return;
    this.listeners[event]?.forEach((callback) => callback(...args));
  }

  public clearListeners(event: Events) {
    if (this.listeners[event]) {
      this.listeners[event] = [];
    }
  }
}