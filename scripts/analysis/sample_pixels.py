"""Print hex colors of reference.mp4 at given (x,y) points for one frame.
Usage: python3 -I sample_pixels.py <video> <frame> x,y [x,y ...]
"""
import subprocess
import sys

W, H = 1280, 720


def main(video, frame, pts):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", video, "-vf", "select=eq(n\\,%d)" % frame,
         "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        check=True, capture_output=True).stdout
    for p in pts:
        x, y = (int(v) for v in p.split(","))
        i = (y * W + x) * 3
        print("%4d,%-4d #%02x%02x%02x" % (x, y, raw[i], raw[i + 1], raw[i + 2]))


if __name__ == "__main__":
    main(sys.argv[1], int(sys.argv[2]), sys.argv[3:])
