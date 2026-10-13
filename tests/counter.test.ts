import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { counterState, counterValue, formatCounter } from "../src/film/counter";
import { TOTAL_FRAMES } from "../src/film/timeline";

// Reference data: full-video OCR of reference.mp4 (frame, value, state, score).
const rows = readFileSync(
  new URL("../reference/analysis/counter_reference.tsv", import.meta.url),
  "utf8",
)
  .trim()
  .split("\n")
  .slice(1)
  .map((l) => {
    const [frame, value, state, score] = l.split("\t");
    return { frame: Number(frame), value, state, score: Number(score) };
  });

test("reference table covers every frame once", () => {
  assert.equal(rows.length, TOTAL_FRAMES);
  rows.forEach((r, i) => assert.equal(r.frame, i));
});

test("counter state matches reference state for all 4410 frames", () => {
  const mismatches = rows.filter((r) => {
    const k = counterState(r.frame).kind;
    return (r.state === "count" ? "count" : r.state) !== k;
  });
  assert.deepEqual(mismatches.map((m) => m.frame), []);
});

test("displayed value matches OCR for every legible frame", () => {
  const mismatches: string[] = [];
  for (const r of rows) {
    if (r.state !== "count" && r.state !== "rewind") continue;
    const v = counterValue(r.frame);
    if (v === null || formatCounter(v) !== r.value) {
      mismatches.push(`${r.frame}: ref ${r.value} got ${v}`);
    }
  }
  assert.deepEqual(mismatches, []);
});

test("spot samples confirmed visually / by OCR", () => {
  const samples: [number, string][] = [
    [0, "0001"], [30, "0031"], [1000, "1001"], [1350, "1351"], [3000, "3001"],
    [3744, "3745"], [3745, "3744"], [3753, "3744"], [3880, "2097"], [3930, "0612"],
    [3990, "0036"], [4019, "0001"], [4032, "0001"], [4320, "4321"], [4350, "4351"],
    [4380, "4381"], [4409, "4410"],
  ];
  for (const [f, s] of samples) {
    assert.equal(formatCounter(counterValue(f)!), s, `frame ${f}`);
  }
  assert.equal(counterValue(4033), null);
  assert.equal(counterValue(4200), null);
});

test("rewind is monotonically non-increasing", () => {
  let prev = Infinity;
  for (let f = 3745; f < 4033; f++) {
    const v = counterValue(f)!;
    assert.ok(v <= prev, `frame ${f}`);
    prev = v;
  }
});

test("out-of-range frames throw", () => {
  assert.throws(() => counterState(-1), RangeError);
  assert.throws(() => counterState(TOTAL_FRAMES), RangeError);
});
