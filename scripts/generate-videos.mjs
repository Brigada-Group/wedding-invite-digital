import { fal } from "@fal-ai/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

if (!process.env.FAL_KEY) {
  console.error("Set FAL_KEY before running. e.g. FAL_KEY=… node generate-videos.mjs");
  process.exit(1);
}

fal.config({ credentials: process.env.FAL_KEY });

const MODEL = "fal-ai/kling-video/v2.5-turbo/pro/image-to-video";

// Each job specifies its own source image so we can animate the couple painting
// and the envelope from different starting frames.
const JOBS = [
  {
    outFile: "main-intro.mp4",
    sourceImage: "main.png",
    duration: "5",
    prompt:
      "Cinematic intro for a watercolor wedding illustration. Elements gently animate in: soft white rose petals drift down through the air, candle flames slowly flare to life and flicker warmly, the heart-shaped flower arch softly sways in a gentle breeze, gentle ocean waves begin to lap rhythmically at the shore, warm golden sunset light shimmers on the water, tiny glowing sparkle particles drift upward. The couple stands completely still, facing away from the camera. Camera is static. Preserves the hand-painted watercolor illustration aesthetic with soft brushstroke textures. No text changes. Romantic, dreamy, peaceful atmosphere.",
  },
  {
    outFile: "main-loop.mp4",
    sourceImage: "scripts/main-intro-last-frame.png",
    duration: "5",
    prompt:
      "Start from the exact provided frame with no jump. Create a seamless boomerang-style idle loop for a watercolor wedding illustration: tiny petal drift, subtle candle flicker, gentle ocean shimmer, and soft breathing sunset light. Motion should travel out and naturally return back toward the starting pose by the end so looping feels continuous. Couple remains completely still with no body/head movement. Locked camera, no zoom, no pan. Preserve exact painting style and composition.",
  },
  {
    outFile: "envelope-intro.mp4",
    sourceImage: "scripts/envelope-closed-vertical.png",
    duration: "5",
    cfgScale: 0.7,
    prompt:
      "Vertical 9:16 cinematic close-up of a sealed cream-colored wedding envelope with embossed rose floral pattern and a deep wine-red wax seal monogrammed with L and M. MOTION: the triangular envelope flap slowly hinges upward and backward on its top edge, tilting up and away from the viewer like a real paper envelope being carefully opened by invisible hands. The wax seal stays attached to the underside of the lifting flap and moves with it. As the flap tilts away, the dark shadowed interior cavity of the envelope is gradually revealed below — a deep triangular dark space where a folded card would sit. The paper edges subtly separate. Camera remains locked in place (no zoom, no pan, no push-in, no dolly). Only the flap moves; the envelope body stays perfectly still. Slow, elegant, refined movement over the full 5 seconds. Warm diffused cinematic lighting catches the embossed roses on the paper. Soft shallow depth of field. Preserve exact cream paper color, exact embossed rose pattern, exact L&M wax seal design, and exact composition. No camera movement. No reframing. No added elements. No text changes. No other motion.",
  },
];

const NEGATIVE =
  "blurry, distorted, warped faces, changed identity, deformed limbs, extra limbs, text changes, logo changes, camera shake, fast motion, photorealistic, flat cartoon, anime style";

async function uploadImage(relativePath) {
  const abs = path.join(ROOT, relativePath);
  const name = path.basename(relativePath);
  const buf = fs.readFileSync(abs);
  const file = new File([buf], name, { type: "image/png" });
  const url = await fal.storage.upload(file);
  return url;
}

async function generate({ imageUrl, prompt, duration, outFile, cfgScale = 0.5 }) {
  const outPath = path.join(ROOT, outFile);
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 0) {
    console.log(`[${outFile}] already exists — skipping (delete to regenerate)`);
    return;
  }

  console.log(`[${outFile}] submitting job… (cfg_scale=${cfgScale})`);
  const result = await fal.subscribe(MODEL, {
    input: {
      prompt,
      image_url: imageUrl,
      duration,
      negative_prompt: NEGATIVE,
      cfg_scale: cfgScale,
    },
    logs: true,
    onQueueUpdate(update) {
      if (update.status === "IN_PROGRESS") {
        update.logs?.forEach((l) => console.log(`[${outFile}]`, l.message));
      } else {
        console.log(`[${outFile}] status: ${update.status}`);
      }
    },
  });

  const videoUrl = result?.data?.video?.url;
  if (!videoUrl) {
    console.error(`[${outFile}] no video URL in response:`, JSON.stringify(result, null, 2));
    throw new Error("Missing video URL");
  }

  console.log(`[${outFile}] downloading ${videoUrl}`);
  const res = await fetch(videoUrl);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  console.log(`[${outFile}] saved (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
}

// Cache uploads per source image so we don't re-upload the same file.
const uploads = new Map();
async function getImageUrl(sourceImage) {
  if (!uploads.has(sourceImage)) {
    uploads.set(
      sourceImage,
      (async () => {
        console.log(`Uploading ${sourceImage} to fal storage…`);
        const url = await uploadImage(sourceImage);
        console.log(`Uploaded ${sourceImage} → ${url}`);
        return url;
      })()
    );
  }
  return uploads.get(sourceImage);
}

// Skip jobs whose output already exists before we bother uploading.
const pending = JOBS.filter((job) => {
  const outPath = path.join(ROOT, job.outFile);
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 0) {
    console.log(`[${job.outFile}] already exists — skipping (delete to regenerate)`);
    return false;
  }
  return true;
});

if (pending.length === 0) {
  console.log("Nothing to generate.");
  process.exit(0);
}

await Promise.all(
  pending.map(async (job) => {
    try {
      const imageUrl = await getImageUrl(job.sourceImage);
      await generate({ imageUrl, ...job });
    } catch (err) {
      console.error(`[${job.outFile}] FAILED:`, err.message);
      throw err;
    }
  })
);

console.log("All videos generated.");
