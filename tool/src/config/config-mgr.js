// import { pkgUpSync } from "pkg-up";
// import { readFileSync } from "fs";
import { createLogger } from '../logger.js';
import chalk from 'chalk';
import { cosmiconfigSync } from "cosmiconfig";
import schema from './schema.json' assert { type: "json" };
import betterAjvErrors from "better-ajv-errors";
import Ajv from 'ajv';

const configLoader = cosmiconfigSync("tool");
const logger = createLogger('config:mgr');
const ajv = new Ajv();

export function getConfig() {
  const result = configLoader.search(process.cwd());
  if (!result) {
    logger.warning('Could not find configuration, using default');
    return { port: 1234 };
  } else {
    const isValid = ajv.validate(schema, result.config);
    if (!isValid) {
      logger.warning(chalk.yellow('Invalid configuration was supplied'));
      console.log();
      console.log(betterAjvErrors(schema, result.config, ajv.errors));
      process.exit(1);
    }
    logger.debug("Found configuration", result.config);
    return result.config;
  }
  //   const pkgPath = pkgUpSync({ cwd: process.cwd() });

  //   if (pkgPath) {
  //     const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  //     if (pkg.tool) {
  //       console.log("Found configuration:", pkg.tool);
  //       return pkg.tool;
  //     } else {
  //       console.log(chalk.yellow("Could not find configuration, using default"));
  //       return { port: 1234 };
  //     }
  //   } else {
  //     console.log(
  //       chalk.red(
  //         "No package.json found in the current directory or its parents."
  //       )
  //     );
  //   }
}
