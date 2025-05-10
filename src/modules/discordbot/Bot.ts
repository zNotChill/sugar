import { Config, CredentialsConfig } from "../../data/Config.ts";
import { eventHandler } from "../../Singletons.ts";
import { Log, Success } from "../../utils/Logger.ts";
import { ModuleBase } from "../base/ModuleBase.ts";
import { createBot, GatewayIntents, createDesiredPropertiesObject, Component, MessageComponentTypes, MessageFlags } from "npm:@discordeno/bot";
import { Events } from "../events/types/Events.ts";
import { OsuClient } from "../tosu/types/TosuResponse.ts";
import { CountryCodes } from "../../types/CountryCodes.ts";
import { HandspeedData } from "../handspeed/types/HandspeedData.ts";
import { HandtrackingData } from "../handspeed/types/HandtrackingData.ts";

export class DiscordBotModule extends ModuleBase {
  public override moduleName: string = "DiscordBotModule";
  public isConnected: boolean = false;
  private bot: any;
  private osu_channel_id: string = Config.discordOsuChannel;
  private handData: HandtrackingData | null = null;

  constructor() {
    super();
    Log("Discord bot module initialized.");
  }

  override async establishConnection() {
    Log("Establishing connection to the Discord bot module...");
    
    this.bot = createBot({
      token: CredentialsConfig.discordToken,
      intents: GatewayIntents.Guilds | GatewayIntents.GuildMessages | GatewayIntents.MessageContent,
      events: {
        ready: () => {
          this.isConnected = true;
          Success("Discord bot module connected successfully.");
          this.listen();
        },
        messageCreate: (_) => {},
      },
      desiredProperties: createDesiredPropertiesObject({
        message: {
          id: true,
          content: true,
          author: true,
          guildId: true,
          member: true,
          timestamp: true,
          channelId: true,
        }
      }),
    });

    if (!this.bot) {
      Error("Discord bot module failed to connect.");
      return;
    }

    await this.bot.start();
  }

  listen() {
    eventHandler.on(Events.HandtrackingData, (data: HandtrackingData) => {
      this.handData = data;
    })

    eventHandler.on(Events.ReplaySubmitted, (message: OsuClient) => {
      if (!this.bot) {
        Error("Discord bot is not connected.");
        return;
      }

      const formatter = new Intl.NumberFormat("en-US")
      const countryCodeFixed = CountryCodes[message.userProfile.countryCode];
      const formattedPP = formatter.format(message.userProfile.performancePoints);

      const rank = message.resultsScreen.grade;
      const rankEmoji = Config.emojis.ranks[rank as keyof typeof Config.emojis.ranks];

      const bm = message.menu.bm;
      const gp = message.gameplay;

      let handDataSection: Array<{ type: number; divider?: boolean; spacing?: number; content?: string }> = [];

      if (
        this.handData &&
        this.handData.totalDistance > 0
      ) {
        handDataSection = [
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          {
            type: 10,
            content: [
              `## Hand Data`,
              `Avg. Speed: **${Math.trunc(this.handData?.averageSpeed / 10)}cm/s**`,
              `Total Distance: **${Math.trunc(this.handData?.totalDistance / 1000)}m**`,
            ].join("\n")
          }
        ]
      }

      this.bot.helpers.sendMessage(this.osu_channel_id, {
        flags: 32768,
        components: [
          {
            type: 14,
            divider: false,
            spacing: 1
          },
          {
            type: 10,
            content: `:flag_${countryCodeFixed}: ${message.userProfile.name} **${formattedPP}pp** (:earth_americas: #${formatter.format(message.userProfile.rank)})`,
          },
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          {
            type: 10,
            content: [
              `-# ⭐ **${bm.stats.fullSR}** - CS **${bm.stats.CS}** - AR **${bm.stats.AR}** - OD **${bm.stats.OD}** - HP **${bm.stats.HP}** - BPM **${bm.stats.BPM.common}**`,
              `${bm.metadata.artist} - ${bm.metadata.title} **[${bm.metadata.difficulty}]**`,
              `-# Beatmap by **${bm.metadata.mapper}**`,
            ].join("\n")
          },
          {
            type: 14,
            divider: true,
            spacing: 1
          },
          {
            type: 10,
            content: [
              `${rankEmoji} **${gp.accuracy.toFixed(2)}%** (${formatter.format(gp.score)} score) ${message.menu.mods.num > 0 ? `**+${message.menu.mods.str}**` : ""}`,
              `**${gp.pp.current}pp**/${gp.pp.fc} (${gp.pp.maxThisPlay} max)`
            ].join("\n")
          },
          ...handDataSection,
          {
            type: 14,
            divider: false,
            spacing: 1
          },
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "Open Mapset",
                style: 5,
                url: `https://osu.ppy.sh/beatmapsets/${bm.set}#osu/${bm.id}`
              },
            ]
          }
        ]
      });
    })
  }
}