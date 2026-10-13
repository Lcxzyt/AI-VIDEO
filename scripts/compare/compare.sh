#!/usr/bin/env bash
# Reference-vs-render frame comparison for RainorbFilm.
# Usage: scripts/compare/compare.sh [frame ...]
#        (no args → frames from reference/analysis/keyframes.json)
# Output: out/cmp/{ref,ren,side,diff}_<F>.png and out/cmp/report.md
# Frame numbers are GLOBAL frames (0..4409).
set -euo pipefail
cd "$(dirname "$0")/../.."

REF=reference/reference.mp4
OUT=out/cmp
COMP=${COMP:-RainorbFilm}
mkdir -p "$OUT"

if [ "$#" -gt 0 ]; then
  FRAMES=("$@")
else
  mapfile -t FRAMES < <(node -e 'for (const k of require("./reference/analysis/keyframes.json").frames) console.log(k.frame)')
fi

for F in "${FRAMES[@]}"; do
  if ! [[ "$F" =~ ^[0-9]+$ ]] || [ "$F" -ge 4410 ]; then
    echo "invalid global frame: $F (must be 0..4409)" >&2
    exit 1
  fi
done

# 1. Reference frames, exact by frame index (not by timestamp).
for F in "${FRAMES[@]}"; do
  ffmpeg -v error -y -i "$REF" -vf "select=eq(n\,$F)" -frames:v 1 -fps_mode passthrough "$OUT/ref_$F.png"
done

# 2. Rendered stills: bundle once, then render each frame.
BUNDLE=$(mktemp -d)
trap 'rm -rf "$BUNDLE"' EXIT
npx remotion bundle --out-dir="$BUNDLE" >/dev/null
for F in "${FRAMES[@]}"; do
  npx remotion still "$BUNDLE" "$COMP" "$OUT/ren_$F.png" --frame="$F" --image-format=png --log=error
done

# 3. Side-by-side, difference image, SSIM/PSNR.
{
  echo "# Reference vs render ($COMP)"
  echo
  echo "Generated $(date -Iseconds). Global frames. SSIM/PSNR over the full 1280×720 frame;"
  echo "frames inside TEMP placeholder scenes are expected to score low."
  echo
  echo "| frame | scenes | SSIM | PSNR (dB) | side-by-side | diff |"
  echo "|---|---|---|---|---|---|"
} > "$OUT/report.md"

for F in "${FRAMES[@]}"; do
  ffmpeg -v error -y -i "$OUT/ref_$F.png" -i "$OUT/ren_$F.png" \
    -filter_complex "[0][1]hstack=inputs=2" "$OUT/side_$F.png"
  ffmpeg -v error -y -i "$OUT/ref_$F.png" -i "$OUT/ren_$F.png" \
    -filter_complex "[0]format=gbrp[a];[1]format=gbrp[b];[a][b]blend=all_mode=difference,eq=contrast=4" "$OUT/diff_$F.png"
  SSIM=$(ffmpeg -i "$OUT/ref_$F.png" -i "$OUT/ren_$F.png" -lavfi ssim -f null - 2>&1 | sed -n 's/.*All:\([0-9.]*\).*/\1/p')
  PSNR=$(ffmpeg -i "$OUT/ref_$F.png" -i "$OUT/ren_$F.png" -lavfi psnr -f null - 2>&1 | sed -n 's/.*average:\([0-9.inf]*\).*/\1/p')
  SCENES=$(node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./tests/ts-resolve.mjs \
    -e "import('./src/film/timeline.ts').then(m => console.log(m.scenesAt($F).map(s => s.id).join('+')))")
  echo "| $F | $SCENES | $SSIM | $PSNR | side_$F.png | diff_$F.png |" >> "$OUT/report.md"
  echo "frame $F  scenes=$SCENES  SSIM=$SSIM  PSNR=$PSNR"
done
echo "report: $OUT/report.md"
