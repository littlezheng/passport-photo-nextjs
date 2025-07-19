// lib/getGitVersion.ts
import { execSync } from "child_process";

export function getGitVersion(): string {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "unknown";
  }
}
