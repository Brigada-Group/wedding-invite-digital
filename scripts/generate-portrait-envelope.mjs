import { fal } from "@fal-ai/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

if (!process.env.FAL_KEY) {
  console.error("Set FAL_KEY before running.");
  process.exit(1);
}

fal.config({ credentials: process.env.FAL_KEY });

async function upload(relativePath) {
  const buf = fs.readFileSync(path.join(ROOT, relativePath));
  const file = new File([buf], path.basename(relativePath), { type: "image/png" });
  return await fal.storage.upload(file);
}

// ────────────────────────────────────────────────────────────
// Step 1: reshape landscape envelope into portrait via Nano Banana
// ────────────────────────────────────────────────────────────
console.log("Uploading landscape envelope…");
const sourceUrl = await upload("envelope-closed.png");
console.log("Uploaded:", sourceUrl);

console.log("Reshaping to 9:16 portrait with Nano Banana…");
const reshape = await fal.subscribe("fal-ai/nano-banana/edit", {
  input: {
    prompt:
      "Reshape this elegant cream-colored wedding envelope into a tall portrait 9:16 orientation. Extend the envelope body vertically so the envelope fills a 9:16 portrait frame from edge to edge. Keep the triangular flap at the top with the exact same embossed rose floral pattern. Keep the deep wine-red wax seal monogrammed with the initials L and M in the center. Add more of the same cream-colored envelope body extending downward naturally, continuing the same embossed rose floral pattern. The portrait envelope must fill the entire frame with minimal or no padding. Preserve the exact cream color, exact L and M wax seal design, exact embossed rose floral pattern, exact paper texture, and exact premium wedding style. Do not change the wax seal, do not change the pattern, do not change the colors.",
    image_urls: [sourceUrl],
    aspect_ratio: "9:16",
    num_images: 1,
    output_format: "png",
  },
  logs: true,
  onQueueUpdate(u) {
    if (u.status !== "IN_QUEUE") console.log(`[nano-banana] ${u.status}`);
  },
});

const portraitUrl = reshape?.data?.images?.[0]?.url;
if (!portraitUrl) {
  console.error("Nano Banana response:", JSON.stringify(reshape, null, 2));
  throw new Error("No portrait URL in Nano Banana response");
}
console.log("Portrait generated:", portraitUrl);

const portraitRes = await fetch(portraitUrl);
const portraitBuf = Buffer.from(await portraitRes.arrayBuffer());
const portraitLocalPath = path.join(ROOT, "scripts/envelope-portrait.png");
fs.writeFileSync(portraitLocalPath, portraitBuf);
console.log(`Saved portrait: ${portraitLocalPath} (${(portraitBuf.length / 1024 / 1024).toFixed(2)} MB)`);

// ────────────────────────────────────────────────────────────
// Step 2: generate envelope intro video with Kling v3 Pro
// ────────────────────────────────────────────────────────────
console.log("Uploading portrait envelope for video gen…");
const portraitFile = new File([portraitBuf], "envelope-portrait.png", { type: "image/png" });
const portraitUploaded = await fal.storage.upload(portraitFile);

console.log("Generating envelope intro with Kling v3 Pro (subtle opening)…");
const video = await fal.subscribe("fal-ai/kling-video/v3/pro/image-to-video", {
  input: {
    prompt:
      "Cinematic full-frame vertical 9:16 shot of a tall portrait-oriented elegant cream-colored wedding envelope. The envelope has an embossed rose floral pattern and a deep wine-red wax seal monogrammed with the initials L and M. The envelope fills the entire frame edge to edge. MOTION: the triangular envelope flap at the top subtly lifts and cracks open just slightly — only about 15 to 20 degrees of opening — teasing a hint of the dark shadowed interior peeking through the small gap, but NEVER opening fully. The wax seal stays attached to the flap and moves with it. Motion is very minimal, slow, elegant, restrained, understated. Subtle warm cinematic lighting with gentle shimmer on the embossed paper. Camera remains completely locked. Preserve the exact cream color, exact L and M wax seal design, exact embossed rose floral pattern, exact envelope composition. Premium wedding invitation aesthetic. No dramatic motion. No full opening. The opening should feel like a held breath, a tease.",
    image_url: portraitUploaded,
    duration: "5",
    negative_prompt:
      "blurry, distorted, warped faces, changed identity, deformed, text changes, logo changes, camera shake, camera zoom, camera push-in, camera pan, fast motion, dramatic motion, full opening, completely opened, flap fully opens, wide-open flap, flap lifts all the way, flap perpendicular to body, dark reveal, large interior visible, envelope shape changes, aspect ratio changes",
  },
  logs: true,
  onQueueUpdate(u) {
    if (u.status !== "IN_QUEUE") console.log(`[kling-v3] ${u.status}`);
  },
});

const videoUrl = video?.data?.video?.url;
if (!videoUrl) {
  console.error("Kling v3 response:", JSON.stringify(video, null, 2));
  throw new Error("No video URL in Kling v3 response");
}
console.log("Video generated:", videoUrl);

const videoRes = await fetch(videoUrl);
const videoBuf = Buffer.from(await videoRes.arrayBuffer());
fs.writeFileSync(path.join(ROOT, "envelope-intro.mp4"), videoBuf);
console.log(`Saved envelope-intro.mp4 (${(videoBuf.length / 1024 / 1024).toFixed(2)} MB)`);

// ────────────────────────────────────────────────────────────
// Step 3: update poster/fallback images
// ────────────────────────────────────────────────────────────
fs.copyFileSync(portraitLocalPath, path.join(ROOT, "envelope-closed-vertical.png"));
fs.copyFileSync(portraitLocalPath, path.join(ROOT, "scripts/envelope-closed-vertical.png"));
console.log("Updated envelope-closed-vertical.png at both locations.");

console.log("✓ Portrait envelope intro regenerated.");
