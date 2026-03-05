#!/usr/bin/env node
"use strict";

const os = require("os");
const path = require("path");
const fs = require("fs");
const https = require("https");
const { execSync } = require("child_process");

const VERSION = require("./package.json").version;
const REPO = "apiark/apiark";

const PLATFORM_MAP = {
  darwin: "apple-darwin",
  linux: "unknown-linux-gnu",
  win32: "pc-windows-msvc",
};

const ARCH_MAP = {
  x64: "x86_64",
  arm64: "aarch64",
};

function getBinaryName() {
  return os.platform() === "win32" ? "apiark.exe" : "apiark";
}

function getDownloadUrl() {
  const platform = PLATFORM_MAP[os.platform()];
  const arch = ARCH_MAP[os.arch()];

  if (!platform || !arch) {
    console.error(`Unsupported platform: ${os.platform()}-${os.arch()}`);
    process.exit(1);
  }

  const target = `${arch}-${platform}`;
  return `https://github.com/${REPO}/releases/download/cli-v${VERSION}/apiark-${target}.tar.gz`;
}

function downloadAndExtract(url, dest) {
  return new Promise((resolve, reject) => {
    const follow = (url, redirects = 0) => {
      if (redirects > 5) return reject(new Error("Too many redirects"));

      https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return follow(res.headers.location, redirects + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Download failed: HTTP ${res.statusCode} from ${url}`));
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const tarball = path.join(os.tmpdir(), "apiark.tar.gz");
          fs.writeFileSync(tarball, Buffer.concat(chunks));

          try {
            const binDir = path.dirname(dest);
            fs.mkdirSync(binDir, { recursive: true });
            execSync(`tar -xzf "${tarball}" -C "${binDir}"`, { stdio: "ignore" });
            fs.chmodSync(dest, 0o755);
            fs.unlinkSync(tarball);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        res.on("error", reject);
      }).on("error", reject);
    };
    follow(url);
  });
}

async function main() {
  const binDir = path.join(__dirname, "bin");
  const binaryPath = path.join(binDir, getBinaryName());

  // Skip download if binary already exists (e.g., local development)
  if (fs.existsSync(binaryPath)) {
    console.log("apiark binary already exists, skipping download.");
    return;
  }

  const url = getDownloadUrl();
  console.log(`Downloading apiark CLI v${VERSION}...`);
  console.log(`  ${url}`);

  try {
    await downloadAndExtract(url, binaryPath);
    console.log("apiark CLI installed successfully.");
  } catch (err) {
    console.error(`Failed to install apiark CLI: ${err.message}`);
    console.error("You can manually download from: https://github.com/apiark/apiark/releases");
    process.exit(1);
  }
}

main();
