import { execSync } from "child_process";
import { readFileSync, existsSync, statSync } from "fs";
import { join } from "path";

const PAT        = process.env.GITHUB_PAT;
const EXPO_TOKEN = process.env.EXPO_TOKEN;
const OWNER      = "kikilashvilikhvicha-art";
const REPO       = "lingosteps";
const ROOT       = process.cwd();

if (!PAT)        { console.error("❌ GITHUB_PAT missing"); process.exit(1); }
if (!EXPO_TOKEN) { console.error("❌ EXPO_TOKEN missing"); process.exit(1); }

const H = {
  Authorization: `Bearer ${PAT}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
  "X-GitHub-Api-Version": "2022-11-28",
};

async function gh(path, method = "GET", body = null) {
  const url = path.startsWith("http") ? path : `https://api.github.com${path}`;
  const res = await fetch(url, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  let json = {};
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

// URL-encode path but keep slashes
function encodePath(p) {
  return p.split("/").map(s => encodeURIComponent(s)).join("/");
}

// ── Fetch full remote tree to get current SHAs ────────────────────────────────
async function fetchRemoteMap() {
  const map = {};
  const { json } = await gh(`/repos/${OWNER}/${REPO}/git/trees/main?recursive=1`);
  if (json.tree) {
    for (const item of json.tree) {
      if (item.type === "blob") map[item.path] = item.sha;
    }
  }
  return map;
}

// ── Upload a single file, refreshing SHA if we get a 409 ─────────────────────
async function uploadOne(filePath, remoteMap) {
  const abs = join(ROOT, filePath);
  if (!existsSync(abs)) return "missing";
  if (statSync(abs).size > 900_000) return "too-large";

  const content = readFileSync(abs).toString("base64");
  const apiPath = `/repos/${OWNER}/${REPO}/contents/${encodePath(filePath)}`;

  const body = { message: `ci: ${filePath}`, content, branch: "main" };
  const existingSha = remoteMap[filePath];
  if (existingSha) body.sha = existingSha;

  let { status, json } = await gh(apiPath, "PUT", body);

  // 409 = branch conflict from concurrent writes. Fetch fresh SHA and retry once.
  if (status === 409 || status === 422) {
    await new Promise(r => setTimeout(r, 500));
    // Re-fetch current SHA for this specific file
    const { json: fileInfo } = await gh(`${apiPath}?ref=main`);
    if (fileInfo.sha) body.sha = fileInfo.sha;
    else delete body.sha;
    body.message = `ci: ${filePath} (retry)`;
    ({ status, json } = await gh(apiPath, "PUT", body));
  }

  if (status === 200 || status === 201) return "ok";
  return `fail-${status}`;
}

// ── Step 1: Fetch current remote file index ───────────────────────────────────
console.log("━━━ [1/5] Fetching remote state...");
let remoteMap = await fetchRemoteMap();
console.log(`      ${Object.keys(remoteMap).length} files on remote`);

// ── Step 2: List all local tracked files ─────────────────────────────────────
console.log("━━━ [2/5] Listing local files...");
const allFiles = execSync("git --no-optional-locks ls-files", { cwd: ROOT })
  .toString().trim().split("\n").filter(Boolean);
console.log(`      ${allFiles.length} files to sync`);

// Prioritise the workflow file so dispatch can work even if rest fail
const priority = ".github/workflows/eas-android-build.yml";
const ordered  = [priority, ...allFiles.filter(f => f !== priority)];

// ── Step 3: Upload sequentially ───────────────────────────────────────────────
console.log("━━━ [3/5] Uploading sequentially (. ok  x fail  s skip)...");
let ok = 0, fail = 0, skip = 0;
const failList = [];

for (const file of ordered) {
  const result = await uploadOne(file, remoteMap);
  if (result === "ok")            { ok++;   process.stdout.write("."); }
  else if (result.startsWith("fail")) { fail++; process.stdout.write("x"); failList.push(`${file}: ${result}`); }
  else                            { skip++; process.stdout.write("s"); }
  // Small delay to avoid burst rate-limiting
  await new Promise(r => setTimeout(r, 100));
}
console.log(`\n      ✅ ${ok} ok   ❌ ${fail} failed   ⏭  ${skip} skipped`);
if (failList.length > 0) {
  console.log("      First failures:", failList.slice(0, 5).join("\n                    "));
}

// ── Step 4: Encrypt + store EXPO_TOKEN secret ─────────────────────────────────
console.log("\n━━━ [4/5] Checking EXPO_TOKEN secret...");
const { json: keyInfo } = await gh(`/repos/${OWNER}/${REPO}/actions/secrets/public-key`);
const { json: existingSecret } = await gh(`/repos/${OWNER}/${REPO}/actions/secrets/EXPO_TOKEN`);

if (existingSecret.name === "EXPO_TOKEN") {
  console.log("      ✅ EXPO_TOKEN secret already set (from previous run)");
} else if (keyInfo.key_id) {
  const sodiumPath = "/home/runner/workspace/node_modules/.pnpm/libsodium-wrappers@0.8.4/node_modules/libsodium-wrappers/dist/modules/libsodium-wrappers.js";
  const sodium = (await import(`file://${sodiumPath}`)).default;
  await sodium.ready;
  const repoKey   = sodium.from_base64(keyInfo.key, sodium.base64_variants.ORIGINAL);
  const secretBuf = sodium.from_string(EXPO_TOKEN);
  const encrypted = sodium.crypto_box_seal(secretBuf, repoKey);
  const encB64    = sodium.to_base64(encrypted, sodium.base64_variants.ORIGINAL);
  const { status } = await gh(`/repos/${OWNER}/${REPO}/actions/secrets/EXPO_TOKEN`, "PUT",
    { encrypted_value: encB64, key_id: keyInfo.key_id });
  console.log("      Secret upload:", status === 201 ? "✅ created" : status === 204 ? "✅ updated" : `❌ ${status}`);
}

// ── Step 5: Trigger EAS workflow ──────────────────────────────────────────────
console.log("\n━━━ [5/5] Triggering EAS Android build workflow...");
await new Promise(r => setTimeout(r, 3000));

const { status: wfStatus, json: wfJson } = await gh(
  `/repos/${OWNER}/${REPO}/actions/workflows/eas-android-build.yml/dispatches`,
  "POST",
  { ref: "main", inputs: { profile: "production" } }
);

if (wfStatus === 204) {
  console.log("      ✅ Workflow queued on GitHub Actions!");
} else {
  console.log(`      ⚠️  Status ${wfStatus}: ${JSON.stringify(wfJson).slice(0, 200)}`);
  console.log(`\n      If 404: go to github.com/${OWNER}/${REPO}/actions`);
  console.log(`      Find "EAS Android AAB Build" → Run workflow → production → Run workflow`);
}

console.log(`
════════════════════════════════════════════════════════════
  Repo    → https://github.com/${OWNER}/${REPO}
  Actions → https://github.com/${OWNER}/${REPO}/actions
  Builds  → https://expo.dev → Projects → LingoSteps → Builds

  AAB ready to download from expo.dev in ~15–20 minutes.
════════════════════════════════════════════════════════════
`);
