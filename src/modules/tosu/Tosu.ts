import { Config } from "../../data/Config.ts";
import { eventHandler } from "../../Singletons.ts";
import { OsuState } from "../../types/OsuState.ts";
import { Error } from "../../utils/Logger.ts";
import { Log, Success } from "../../utils/Logger.ts";
import { ModuleBase } from "../base/ModuleBase.ts";
import { Events } from "../events/types/Events.ts";
import { OsuClient } from "./types/TosuResponse.ts";

export class TosuModule extends ModuleBase {
  private ws: WebSocket | null = null;
  public isConnected: boolean = false;
  public override moduleName: string = "TosuModule";

  constructor() {
    super();
    Log("Tosu module initialized.");
  }

  override establishConnection() {
    Log("Establishing connection to the Tosu module...");
    this.ws = new WebSocket("ws://localhost:24050/ws");

    this.ws.onopen = () => {
      this.isConnected = true;
      Success("Tosu module connected successfully.");
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      this.onDisconnect();
    };

    this.ws.onerror = (_error) => {
      this.isConnected = false;
    };

    this.ws.onmessage = (event) => {
      this.onMessage(event.data);
    };
  }

  override onMessage(message: string) {
    try {
      const newData = JSON.parse(message) as OsuClient;
      const newState = newData.menu.state;

      const recentMessages = this.getRecentMessages(15);
      const recentStates = recentMessages.map((msg) => (msg.data as OsuClient).menu.state);

      const replaySubmittedAt = new Date(newData.resultsScreen.createdAt).valueOf();
      const timeSinceReplaySubmitted = Date.now() - replaySubmittedAt;

      const wasRecentlyPlaying = recentStates.includes(OsuState.Playing);
      const isNowViewingReplayScore = newState === OsuState.ViewingReplayScore;

      const isReplayOwner = newData.resultsScreen.name === newData.userProfile.name;

      const isNewReplay = timeSinceReplaySubmitted <= Config.replaySubmitThresholdMS;
      const isFreshMessage = !recentMessages.some((msg) => msg.timestamp === Date.now());

      // "foolproof" way of checking if the user just submitted a replay
      // based on 5 attributes:
      // 1. The replay was submitted within the last 5 seconds
      // 3. The user was recently in state 2 (playing)
      // 3. The user is now in state 7 (viewing replay score)
      // 4. The user is the owner of the replay
      // If all of these are true, we can assume the user just submitted a replay
      // and we can clear the message history to avoid duplicates
      if (
        isNewReplay &&
        wasRecentlyPlaying &&
        isFreshMessage &&
        isNowViewingReplayScore &&
        isReplayOwner
      ) {
        Log("User just submitted a replay.");
        eventHandler.emit(Events.StopHandtracking);
        eventHandler.emit(Events.ReplaySubmitted, newData);
        this.clearMessageHistory();
      }

      // check if the user just entered the playing state
      if (
        newState === OsuState.Playing &&
        !recentStates.includes(OsuState.Playing)
      ) {
        eventHandler.emit(Events.StartHandtracking);
        this.clearMessageHistory();
      }

      // check if the user just stopped playing
      if (
        newState !== OsuState.Playing &&
        recentStates.includes(OsuState.Playing) &&
        recentStates[recentStates.length - 1] === OsuState.Playing
      ) {
        setTimeout(() => {
          eventHandler.emit(Events.StopHandtracking);
        }, 100);
      }
      
      this.addMessageToHistory({
        timestamp: Date.now(),
        data: newData,
      });
    } catch (error) {
      if (error instanceof Error) {
        Error("Failed to parse message:", (error as Error).message);
      } else {
        Error("Failed to parse message:", error as string);
      }
    }
  }
}