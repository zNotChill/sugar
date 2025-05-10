export const Config = {
  /**
   * When submitting a replay, going from state 2 to 7, the tosu module picks this up,
   * but if you watch a replay, it also goes from state 2 to 7, which is bad.
   * Therefore, we check if the replay was submitted within the last 5 seconds from
   * when the state changed to 7.
   */
  replaySubmitThresholdMS: 5000,
  discordOsuChannel: Deno.env.get("DISCORD_OSU_CHANNEL") || "",
  botPrefix: ".",
  emojis: {
    ranks: {
      XH: Deno.env.get("OSU_XH_EMOJI_ID"),
      X: Deno.env.get("OSU_X_EMOJI_ID"),
      SH: Deno.env.get("OSU_SH_EMOJI_ID"),
      S: Deno.env.get("OSU_S_EMOJI_ID"),
      A: Deno.env.get("OSU_A_EMOJI_ID"),
      B: Deno.env.get("OSU_B_EMOJI_ID"),
      C: Deno.env.get("OSU_C_EMOJI_ID"),
      D: Deno.env.get("OSU_D_EMOJI_ID"),
    }
  }
} as const;

export const CredentialsConfig = {
  discordToken: Deno.env.get("DISCORD_TOKEN") || "",
  discordClientId: Deno.env.get("DISCORD_CLIENT_ID") || "",
}