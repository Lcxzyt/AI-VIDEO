"""Template OCR of the top-bar frame counter in reference.mp4 (pure Python).

Input: raw gray crop (80x22 @ x=968,y=43) of every frame, produced by:
  ffmpeg -i reference/reference.mp4 -vf "crop=80:22:968:43,format=gray" -f rawvideo counter_all.raw
Templates are trained on frames [0, 3700) assuming value = frame + 1 (verified
afterwards: every training frame must re-classify to f+1). Each cell is matched
with a +/-2 px x, +/-1 px y shift search using normalized correlation.
Output TSV: frame, value (or '-' when no white digits), min digit score, max lum.
"""
import sys

W, H = 80, 22
X0, ADV, CW = 12, 12, 12   # digit cell origin / advance / width inside the crop
Y0, CH = 3, 17             # digit rows inside the crop
TRAIN_END = 3700


def load(path):
    data = open(path, "rb").read()
    n = len(data) // (W * H)
    return [data[i * W * H:(i + 1) * W * H] for i in range(n)]


def cell(img, pos, dx=0, dy=0):
    out = []
    for y in range(CH):
        yy = Y0 + y + dy
        for x in range(CW):
            xx = X0 + pos * ADV + x + dx
            out.append(img[yy * W + xx] if 0 <= xx < W and 0 <= yy < H else 0)
    return out


def norm(v):
    m = sum(v) / len(v)
    d = [a - m for a in v]
    s = sum(a * a for a in d) ** 0.5 or 1.0
    return [a / s for a in d]


def main(raw, out):
    frames = load(raw)
    sums = {}
    for f in range(TRAIN_END):
        s = "%04d" % (f + 1)
        for p in range(4):
            key = (p, s[p])
            c = cell(frames[f], p)
            acc = sums.setdefault(key, [0.0] * len(c) + [0])
            for i, v in enumerate(c):
                acc[i] += v
            acc[-1] += 1
    tpl = {k: norm([a / v[-1] for a in v[:-1]]) for k, v in sums.items()}
    rows = []
    for f, img in enumerate(frames):
        lum = max(img[(Y0) * W:(Y0 + CH) * W])
        if lum < 200:
            rows.append((f, "-", 0.0, lum))
            continue
        digits, worst = "", 1.0
        for p in range(4):
            best = (-2.0, "?")
            cands = [(dx, dy) for dx in range(-2, 3) for dy in range(-1, 2)]
            for dx, dy in cands:
                c = norm(cell(img, p, dx, dy))
                # Glyphs are identical at every position (monospace, 12 px
                # advance), so any position's template may match; this lets
                # the never-trained thousands digit '4' (frames >= 4320)
                # be read via the hundreds/tens/units '4' templates.
                for (_pp, d), t in tpl.items():
                    sc = sum(a * b for a, b in zip(c, t))
                    if sc > best[0]:
                        best = (sc, d)
            digits += best[1]
            worst = min(worst, best[0])
        rows.append((f, digits, worst, lum))
    with open(out, "w") as fh:
        fh.write("frame\tvalue\tscore\tmaxlum\n")
        for f, v, s, l in rows:
            fh.write("%d\t%s\t%.3f\t%d\n" % (f, v, s, l))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
