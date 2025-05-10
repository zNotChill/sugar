import { eventHandler } from "../../Singletons.ts";
import { Log, Success } from "../../utils/Logger.ts";
import { ModuleBase } from "../base/ModuleBase.ts";
import { Events } from "../events/types/Events.ts";
import { handspeedConversionsMM } from "./types/HandspeedConversions.ts";
import { HandspeedData } from "./types/HandspeedData.ts";
import { HandtrackingData } from "./types/HandtrackingData.ts";

export class HandspeedModule extends ModuleBase {
  private ws: WebSocket | null = null;
  public isConnected: boolean = false;
  public override moduleName: string = "HandspeedModule";

  public handTrackingData: HandspeedData[] = [];
  public isTracking: boolean = false;
  public trackingStartTime: number | null = null;

  constructor() {
    super();
    Log("Handspeed module initialized.");
  }

  override establishConnection() {
    Log("Establishing connection to the Handspeed module...");
    this.ws = new WebSocket("ws://localhost:8073/data", "json");

    this.ws.onopen = () => {
      this.isConnected = true;
      Success("Handspeed module connected successfully.");
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

    eventHandler.on(Events.StartHandtracking, () => {
      if (this.isTracking) return;

      this.startTracking();
      eventHandler.emit(Events.HandtrackingStarted);
      Log("Hand tracking started.");
    });

    eventHandler.on(Events.StopHandtracking, () => {
      if (!this.isTracking) return;
      
      this.stopTracking();
      eventHandler.emit(Events.HandtrackingFinished);
      eventHandler.emit(Events.HandtrackingData, {
        data: this.getTrackingData(),
        startDistance: this.getStartDistance(),
        averageSpeed: this.getAverageSpeed(),
        totalDistance: this.getTotalDistance(),
        trackingDuration: this.getTrackingDuration(),
      } as HandtrackingData);
      Log("Hand tracking stopped.");
    });
  }

  override onMessage(message: string) {
    try {
      const newData = JSON.parse(message);
      
      const distanceMM = this.convertDistanceToMM(newData.distance) || 0;
      const speedMMPS = this.convertDistanceToMM(newData.speed.replace("/s", "")) || 0;

      if (this.isTracking) {
        this.handTrackingData.push({
          distance: newData.distance,
          speed: newData.speed,
          speedMMPS: speedMMPS,
          distanceMM: distanceMM,
        });
      }

    } catch (error) {
      if (error instanceof Error) {
        this.onError(error);
      } else {
        this.onError(new Error(String(error)));
      }
    }
  }

  convertDistanceToMM(distance: string) {
    const regex = /(\d+(\.\d+)?)(mm|cm|m|km)/;
    const match = distance.match(regex);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[3] as keyof typeof handspeedConversionsMM;

      return value * handspeedConversionsMM[unit];
    }
    return null;
  }

  startTracking() {
    this.isTracking = true;
    this.trackingStartTime = Date.now();
    this.handTrackingData = [];
  }

  stopTracking() {
    this.isTracking = false;
  }

  
  getTrackingData() {
    return this.handTrackingData;
  }

  getStartDistance() {
    if (this.handTrackingData.length === 0) {
      return 0;
    }
    return this.handTrackingData[0].distanceMM;
  }

  getAverageSpeed() {
    if (this.handTrackingData.length === 0) {
      return 0;
    }

    const totalSpeed = this.handTrackingData.reduce((acc, data) => acc + data.speedMMPS, 0);
    return totalSpeed / this.handTrackingData.length;
  }

  getTotalDistance() {
    if (this.handTrackingData.length === 0) {
      return 0;
    }

    const firstData = this.handTrackingData[0];
    const lastData = this.handTrackingData[this.handTrackingData.length - 1];
    const totalDistance = lastData.distanceMM - firstData.distanceMM;
    return totalDistance;
  }

  getTrackingDuration() {
    if (this.trackingStartTime === null) {
      return 0;
    }
    return Date.now() - this.trackingStartTime;
  }
}