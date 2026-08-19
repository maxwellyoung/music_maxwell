import { execFileSync } from "node:child_process";

const status = execFileSync("git", ["status", "--porcelain"], {
  encoding: "utf8",
}).trim();

if (status) {
  console.error("Deployment blocked: the Git worktree is not clean.");
  console.error(status);
  process.exit(1);
}

console.log("Deployment source is committed and clean.");
