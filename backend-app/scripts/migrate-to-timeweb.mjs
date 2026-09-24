import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", ...options });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited ${code}`));
    });
  });
}

if (process.env.CONFIRM_FLAWLESS !== "yes") {
  console.error(
    "Отказ: перенос в Timeweb запускается только после безукоризненной работы локальной системы. Сначала npm run sync. Затем CONFIRM_FLAWLESS=yes и TIMEWEB_DATABASE_URL.",
  );
  process.exit(2);
}

const targetUrl = process.env.TIMEWEB_DATABASE_URL;
if (!targetUrl) {
  console.error("Отказ: нет TIMEWEB_DATABASE_URL.");
  process.exit(2);
}

await run(process.execPath, ["scripts/sync-system.mjs"], {
  cwd: backendRoot,
  env: process.env,
});

const dumpDir = await mkdtemp(path.join(tmpdir(), "bizon-timeweb-"));
const dumpFile = path.join(dumpDir, "bizon.dump");
try {
  await run("sudo", [
    "docker",
    "exec",
    "bizon-postgres",
    "pg_dump",
    "-Fc",
    "-U",
    "postgres",
    "-d",
    "bizon",
    "-f",
    "/tmp/bizon.dump",
  ]);
  await run("sudo", ["docker", "cp", "bizon-postgres:/tmp/bizon.dump", dumpFile]);
  await run("sudo", [
    "docker",
    "run",
    "--rm",
    "-v",
    `${dumpFile}:/dump/bizon.dump:ro`,
    "postgres:16-alpine",
    "pg_restore",
    "-d",
    targetUrl,
    "--no-owner",
    "--no-privileges",
    "--clean",
    "--if-exists",
    "/dump/bizon.dump",
  ]);
  console.log("Timeweb restore finished.");
} finally {
  await rm(dumpDir, { recursive: true, force: true });
}
