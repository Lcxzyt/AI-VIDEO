"""Print horizontal runs of 'ink' (lum > threshold) in a horizontal band of one frame.
Usage: python3 -I col_profile.py <video> <frame> <y0> <y1> [threshold] [gap]
"""
import subprocess
import sys

W = 1280


def main(video, frame, y0, y1, thr=60, gap=4):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", video, "-vf", "select=eq(n\\,%d),format=gray" % frame,
         "-frames:v", "1", "-f", "rawvideo", "-"], check=True, capture_output=True).stdout
    ink = []
    for x in range(W):
        col = [raw[y * W + x] for y in range(y0, y1)]
        m = max(col)
        ys = [y0 + i for i, v in enumerate(col) if v > thr]
        ink.append((m, ys))
    runs, cur = [], None
    for x, (m, ys) in enumerate(ink):
        if ys:
            if cur and x - cur[1] <= gap:
                cur[1] = x; cur[2] = max(cur[2], m); cur[3] = min(cur[3], ys[0]); cur[4] = max(cur[4], ys[-1])
            else:
                if cur: runs.append(cur)
                cur = [x, x, m, ys[0], ys[-1]]
    if cur: runs.append(cur)
    for a, b, m, ya, yb in runs:
        print("x %4d-%4d  y %3d-%3d  maxlum %3d" % (a, b, ya, yb, m))


if __name__ == "__main__":
    a = sys.argv
    main(a[1], int(a[2]), int(a[3]), int(a[4]), *(int(v) for v in a[5:]))
