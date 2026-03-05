#!/usr/bin/env node
"use strict";

const path = require("path");
const { execFileSync } = require("child_process");
const os = require("os");

const binaryName = os.platform() === "win32" ? "apiark.exe" : "apiark";
const binaryPath = path.join(__dirname, binaryName);

try {
  execFileSync(binaryPath, process.argv.slice(2), { stdio: "inherit" });
} catch (err) {
  if (err.status !== undefined) {
    process.exit(err.status);
  }
  console.error(`Failed to run apiark: ${err.message}`);
  console.error("Try reinstalling: npm install -g @apiark/cli");
  process.exit(1);
}
