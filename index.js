#!/usr/bin/env node

import prog from "caporal";
import chokidar from "chokidar";
import debounce from "lodash.debounce";
import fs from "fs";
import { spawn } from "child_process";
import chalk from "chalk";

prog
  .version("1.0.0")
  .argument("[filename]", "Name of the file to execute")
  .action(async ({ filename }) => {
    const name = filename || "index.js";
    try {
      await fs.promises.access(name);
    } catch (err) {
      throw new Error(`Could not find the file ${name}`);
    }

    let proc;
    const start = debounce(() => {
      if (proc) {
        proc.kill();
      }
      console.log(chalk.bgRed.bold(">>>>>>Starting proces...."));
      proc = spawn("node", [name], { stdio: "inherit" });
    }, 100);

    chokidar
      .watch(".", {
        ignored: /node_modules/,
      })
      .on("add", start)
      .on("change", start)
      .on("unlink", start);
  });

prog.parse(process.argv);
