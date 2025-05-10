import { HandspeedData } from "./HandspeedData.ts";

export type HandtrackingData = {
  data: HandspeedData[],
  startDistance: number,
  averageSpeed: number,
  totalDistance: number,
  trackingDuration: number
}