import { OsuState } from "../types/OsuState.ts";
import { Error } from "../utils/Logger.ts";
import { Log, Success } from "../utils/Logger.ts";
import { ModuleBase } from "./base/ModuleBase.ts";
import { OsuClient } from "./types/TosuResponse.ts";

export class TosuModule extends ModuleBase {
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private previousMessage: OsuClient = {
    client: "",
    settings: {
      showInterface: false,
      folders: {
        game: "",
        skin: "",
        songs: ""
      }
    },
    menu: {
      mainMenu: {
        bassDensity: 0
      },
      state: 0,
      gameMode: 0,
      isChatEnabled: 0,
      bm: {
        time: {
          firstObj: 0,
          current: 0,
          full: 0,
          mp3: 0
        },
        id: 0,
        set: 0,
        md5: "",
        rankedStatus: 0,
        metadata: {
          artist: "",
          artistOriginal: "",
          title: "",
          titleOriginal: "",
          mapper: "",
          difficulty: ""
        },
        stats: {
          AR: 0,
          CS: 0,
          OD: 0,
          HP: 0,
          SR: 0,
          BPM: {
            realtime: 0,
            common: 0,
            min: 0,
            max: 0
          },
          circles: 0,
          sliders: 0,
          spinners: 0,
          holds: 0,
          maxCombo: 0,
          fullSR: 0,
          memoryAR: 0,
          memoryCS: 0,
          memoryOD: 0,
          memoryHP: 0
        },
        path: {
          full: "",
          folder: "",
          file: "",
          bg: "",
          audio: ""
        }
      },
      mods: {
        num: 0,
        str: ""
      },
      pp: {
        strains: [],
        strainsAll: {
          series: [],
          xaxis: []
        }
      }
    },
    gameplay: {
      gameMode: 0,
      name: "",
      score: 0,
      accuracy: 0,
      combo: {
        current: 0,
        max: 0
      },
      hp: {
        normal: 0,
        smooth: 0
      },
      hits: {
        0: 0,
        50: 0,
        100: 0,
        300: 0,
        geki: 0,
        katu: 0,
        sliderBreaks: 0,
        grade: {
          current: "",
          maxThisPlay: ""
        },
        unstableRate: 0,
        hitErrorArray: []
      },
      pp: {
        current: 0,
        fc: 0,
        maxThisPlay: 0
      },
      keyOverlay: {
        k1: {
          isPressed: false,
          count: 0
        },
        k2: {
          isPressed: false,
          count: 0
        },
        m1: {
          isPressed: false,
          count: 0
        },
        m2: {
          isPressed: false,
          count: 0
        }
      },
      leaderboard: {
        hasLeaderboard: false,
        isVisible: false,
        ourplayer: {
          name: "",
          score: 0,
          combo: 0,
          maxCombo: 0,
          mods: "",
          h300: 0,
          h100: 0,
          h50: 0,
          h0: 0,
          team: 0,
          position: 0,
          isPassing: 0
        },
        slots: []
      },
      _isReplayUiHidden: false
    },
    resultsScreen: {
      mode: 0,
      name: "",
      score: 0,
      accuracy: null,
      maxCombo: 0,
      mods: {
        num: 0,
        str: ""
      },
      geki: 0,
      katu: 0,
      grade: "",
      createdAt: ""
    },
    userProfile: {
      rawLoginStatus: 0,
      name: "",
      accuracy: 0,
      rankedScore: 0,
      id: 0,
      level: 0,
      playCount: 0,
      playMode: 0,
      rank: 0,
      countryCode: 0,
      performancePoints: 0,
      rawBanchoStatus: 0,
      backgroundColour: ""
    },
    tourney: {
      manager: {
        ipcState: 0,
        bestOF: 0,
        teamName: {
          left: "",
          right: ""
        },
        stars: {
          left: 0,
          right: 0
        },
        bools: {
          scoreVisible: false,
          starsVisible: false
        },
        chat: [],
        gameplay: {
          score: {
            left: 0,
            right: 0
          }
        }
      },
      ipcClients: []
    }
  };

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

    this.ws.onerror = (error) => {
      this.isConnected = false;
    };

    this.ws.onmessage = (event) => {
      this.onMessage(event.data);
    };
  }

  override onDisconnect() {
    Log("Tosu module disconnected. Cleaning up resources...");
  }

  override onError(error: Error) {
    Log("An error occurred in the Tosu module:", error.message);
  }

  override onMessage(message: string) {
    try {
      const newData = JSON.parse(message) as OsuClient;

      const newState = newData.menu.state;
      const oldState = this.previousMessage.menu.state;

      if (
        newState === OsuState.ViewingReplayScore &&
        oldState === OsuState.Playing
      ) {
        Log("User just finished playing a map.");
      }

      this.previousMessage = newData;
    } catch (error) {
      if (error instanceof Error) {
        Error("Failed to parse message:", (error as Error).message);
      } else {
        Error("Failed to parse message: An unknown error occurred.");
      }
    }
  }
}