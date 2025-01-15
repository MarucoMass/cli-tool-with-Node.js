import { pkgUpSync } from "pkg-up";
import { readFileSync } from "fs";
import { cosmiconfigSync } from "cosmiconfig";
const configLoader = cosmiconfigSync("tool");
import schema from './schema.json' assert { type: "json" };
import Ajv from 'ajv';
const ajv = new Ajv();

export function getConfig() {
  const result = configLoader.search(process.cwd());
  if (!result) {
    console.log(chalk.yellow("Could not find configuration, using default"));
    return { port: 1234 };
  } else {
    const isValid = ajv.validate(schema, result.config);
    if (!isValid) {
      console.log(chalk.yellow('Invalid configuration was supplied'));
      console.log(ajv.errors);
      process.exit(1);
    }
    console.log("Found configuration", result.config);
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
