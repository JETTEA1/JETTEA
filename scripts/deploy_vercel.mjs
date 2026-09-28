import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || "";
const PROJECT_ID = process.env.VERCEL_PROJECT_ID || "prj_m0eZouxw6cWmNtYxjjHbNhrcBf5r";
const PROJECT_NAME = "jettea";

const IGNORED = [
  'node_modules',
  '.next',
  '.git',
  '.env.local',
  'scripts'
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    if (IGNORED.includes(file)) return;
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function uploadFile(filePath, rootDir) {
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const buffer = fs.readFileSync(filePath);
  const sha = crypto.createHash('sha1').update(buffer).digest('hex');
  const size = buffer.length;

  const res = await fetch('https://api.vercel.com/v2/files', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/octet-stream',
      'Content-Length': size.toString(),
      'x-vercel-digest': sha
    },
    body: buffer
  });

  if (res.status !== 200 && res.status !== 409) {
    const errText = await res.text();
    console.warn(`Upload file warning [${relativePath}]: ${res.status} - ${errText}`);
  }

  return {
    file: relativePath,
    sha: sha,
    size: size
  };
}

async function main() {
  console.log("🚀 Gathering project files for Vercel upload...");
  const rootDir = process.cwd();
  const allFiles = getAllFiles(rootDir);
  console.log(`Found ${allFiles.length} files to process.`);

  const filePayloads = [];
  for (let i = 0; i < allFiles.length; i++) {
    const f = allFiles[i];
    process.stdout.write(`Uploading [${i + 1}/${allFiles.length}] ${path.relative(rootDir, f)}...\r`);
    const payload = await uploadFile(f, rootDir);
    filePayloads.push(payload);
  }
  console.log("\n✅ All files uploaded/synced to Vercel storage.");

  console.log("📦 Creating Vercel deployment...");
  const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: PROJECT_NAME,
      project: PROJECT_ID,
      target: 'production',
      files: filePayloads,
      projectSettings: {
        framework: 'nextjs'
      }
    })
  });

  const deployData = await deployRes.json();
  if (!deployRes.ok) {
    console.error("❌ Deployment creation failed:", JSON.stringify(deployData, null, 2));
    process.exit(1);
  }

  console.log("🎉 Deployment created successfully!");
  console.log("Deployment ID:", deployData.id);
  console.log("Inspect URL:", `https://vercel.com/jettea/jettea/${deployData.id}`);
  console.log("Deployment URL:", `https://${deployData.url}`);

  console.log("⏳ Monitoring build status...");
  let state = deployData.readyState || 'BUILDING';
  let attempts = 0;
  while (state === 'BUILDING' || state === 'INITIALIZING' || state === 'QUEUED') {
    attempts++;
    await new Promise(r => setTimeout(r, 4000));
    const checkRes = await fetch(`https://api.vercel.com/v13/deployments/${deployData.id}`, {
      headers: { 'Authorization': `Bearer ${VERCEL_TOKEN}` }
    });
    const checkData = await checkRes.json();
    state = checkData.readyState;
    process.stdout.write(`[Attempt ${attempts}] State: ${state}...\r`);
    if (state === 'READY') {
      console.log(`\n\n✨ DEPLOYMENT READY! Live at: https://${checkData.url}`);
      console.log(`Production Aliases:`, checkData.alias);
      return;
    }
    if (state === 'ERROR' || state === 'CANCELED') {
      console.error(`\n\n❌ Build ${state}:`, JSON.stringify(checkData, null, 2));
      process.exit(1);
    }
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
