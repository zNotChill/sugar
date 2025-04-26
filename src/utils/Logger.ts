import chalk from "npm:chalk";
import { formatUnixTimestamp } from "./Time.ts";

export function Log(message: string, origin: string = "Logger") {
  console.log(
    chalk.whiteBright(`[${formatUnixTimestamp()}] `) +
    chalk.bgCyanBright.whiteBright(` INFO `) +
    chalk.cyan(` [${origin}] `) +
    chalk.gray(`${message}`)
  );
}

export function Success(message: string, origin: string = "Logger") {
  console.log(
    chalk.whiteBright(`[${formatUnixTimestamp()}] `) +
    chalk.bgGreenBright.whiteBright(` SUC. `) +
    chalk.green(` [${origin}] `) +
    chalk.gray(`${message}`)
  );
}

export function Warn(message: string, origin: string = "Logger") {
  console.warn(
    chalk.whiteBright(`[${formatUnixTimestamp()}] `) +
    chalk.bgYellowBright.whiteBright(` WARN `) +
    chalk.yellow(` [${origin}] `) +
    chalk.gray(`${message}`)
  )
}

export function Error(message: string, origin: string = "Logger") {
  console.error(
    chalk.whiteBright(`[${formatUnixTimestamp()}] `) +
    chalk.bgRedBright.whiteBright(` ERR. `) +
    chalk.red(` [${origin}] `) +
    chalk.gray(`${message}`)
  )
}