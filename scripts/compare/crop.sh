#!/usr/bin/env bash
# Region comparison (e.g. the top bar) for frames already produced by compare.sh.
# Usage: scripts/compare/crop.sh <w:h:x:y> <scale> frame [frame ...]
# Example (counter): scripts/compare/crop.sh 270:30:940:40 4 30 3880
set -euo pipefail
cd "$(dirname "$0")/../.."
CROP=$1; SCALE=$2; shift 2
OUT=out/cmp
for F in "$@"; do
  ffmpeg -v error -y -i "$OUT/ref_$F.png" -i "$OUT/ren_$F.png" -filter_complex \
    "[0]crop=$CROP,scale=iw*$SCALE:-1:flags=neighbor[a];[1]crop=$CROP,scale=iw*$SCALE:-1:flags=neighbor[b];[a][b]vstack" \
    "$OUT/crop_${F}_${CROP//:/_}.png"
  echo "$OUT/crop_${F}_${CROP//:/_}.png"
done
