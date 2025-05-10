// deno-lint-ignore-file
type OsuClientSettings = {
  showInterface: boolean;
  folders: {
    game: string;
    skin: string;
    songs: string;
  };
};

type OsuClientMenu = {
  mainMenu: {
    bassDensity: number;
  };
  state: number;
  gameMode: number;
  isChatEnabled: number;
  bm: {
    time: {
      firstObj: number;
      current: number;
      full: number;
      mp3: number;
    };
    id: number;
    set: number;
    md5: string;
    rankedStatus: number;
    metadata: {
      artist: string;
      artistOriginal: string;
      title: string;
      titleOriginal: string;
      mapper: string;
      difficulty: string;
    };
    stats: {
      AR: number;
      CS: number;
      OD: number;
      HP: number;
      SR: number;
      BPM: {
        realtime: number;
        common: number;
        min: number;
        max: number;
      };
      circles: number;
      sliders: number;
      spinners: number;
      holds: number;
      maxCombo: number;
      fullSR: number;
      memoryAR: number;
      memoryCS: number;
      memoryOD: number;
      memoryHP: number;
    };
    path: {
      full: string;
      folder: string;
      file: string;
      bg: string;
      audio: string;
    };
  };
  mods: {
    num: number;
    str: string;
  };
  pp: {
    [key: number]: number;
    strains: any[];
    strainsAll: {
      series: Array<{
        name: string;
        data: any[];
      }>;
      xaxis: any[];
    };
  };
};

type OsuGameplay = {
  gameMode: number;
  name: string;
  score: number;
  accuracy: number;
  combo: {
    current: number;
    max: number;
  };
  hp: {
    normal: number;
    smooth: number;
  };
  hits: {
    0: number;
    50: number;
    100: number;
    300: number;
    geki: number;
    katu: number;
    sliderBreaks: number;
    grade: {
      current: string;
      maxThisPlay: string;
    };
    unstableRate: number;
    hitErrorArray: any[];
  };
  pp: {
    current: number;
    fc: number;
    maxThisPlay: number;
  };
  keyOverlay: {
    k1: {
      isPressed: boolean;
      count: number;
    };
    k2: {
      isPressed: boolean;
      count: number;
    };
    m1: {
      isPressed: boolean;
      count: number;
    };
    m2: {
      isPressed: boolean;
      count: number;
    };
  };
  leaderboard: {
    hasLeaderboard: boolean;
    isVisible: boolean;
    ourplayer: {
      name: string;
      score: number;
      combo: number;
      maxCombo: number;
      mods: string;
      h300: number;
      h100: number;
      h50: number;
      h0: number;
      team: number;
      position: number;
      isPassing: number;
    };
    slots: any[];
  };
  _isReplayUiHidden: boolean;
};

type OsuResultsScreen = {
  [key: number]: number;
  mode: number;
  name: string;
  score: number;
  accuracy: number | null;
  maxCombo: number;
  mods: {
    num: number;
    str: string;
  };
  geki: number;
  katu: number;
  grade: string;
  createdAt: string;
};

type OsuUserProfile = {
  rawLoginStatus: number;
  name: string;
  accuracy: number;
  rankedScore: number;
  id: number;
  level: number;
  playCount: number;
  playMode: number;
  rank: number;
  countryCode: number;
  performancePoints: number;
  rawBanchoStatus: number;
  backgroundColour: string;
};

type OsuTourney = {
  manager: {
    ipcState: number;
    bestOF: number;
    teamName: {
      left: string;
      right: string;
    };
    stars: {
      left: number;
      right: number;
    };
    bools: {
      scoreVisible: boolean;
      starsVisible: boolean;
    };
    chat: any[];
    gameplay: {
      score: {
        left: number;
        right: number;
      };
    };
  };
  ipcClients: any[];
};

export type OsuClient = {
  client: string;
  settings: OsuClientSettings;
  menu: OsuClientMenu;
  gameplay: OsuGameplay;
  resultsScreen: OsuResultsScreen;
  userProfile: OsuUserProfile;
  tourney: OsuTourney;
};
