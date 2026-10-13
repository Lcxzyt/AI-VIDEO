import assert from "node:assert/strict";
import { test } from "node:test";
import {
  SCENES,
  TOTAL_FRAMES,
  overlaps,
  scenesAt,
  toGlobal,
  toLocal,
} from "../src/film/timeline";

test("every scene is a non-empty half-open interval inside [0, TOTAL_FRAMES)", () => {
  for (const s of SCENES) {
    assert.ok(Number.isInteger(s.from) && Number.isInteger(s.to), s.id);
    assert.ok(s.from >= 0, `${s.id} from < 0`);
    assert.ok(s.to <= TOTAL_FRAMES, `${s.id} to > ${TOTAL_FRAMES}`);
    assert.ok(s.to > s.from, `${s.id} empty`);
  }
});

test("scenes start at 0, end at TOTAL_FRAMES, ordered and monotonic", () => {
  assert.equal(TOTAL_FRAMES, 4410);
  assert.equal(SCENES[0].from, 0);
  assert.equal(SCENES[SCENES.length - 1].to, TOTAL_FRAMES);
  for (let i = 1; i < SCENES.length; i++) {
    assert.ok(SCENES[i].from > SCENES[i - 1].from, `${SCENES[i].id} from not increasing`);
    assert.ok(SCENES[i].to > SCENES[i - 1].to, `${SCENES[i].id} to not increasing`);
    // No gap: next scene starts at or before the previous one ends.
    assert.ok(SCENES[i].from <= SCENES[i - 1].to, `gap before ${SCENES[i].id}`);
  }
});

test("all 4410 frames 0..4409 are covered by at least one scene", () => {
  const uncovered: number[] = [];
  for (let f = 0; f < TOTAL_FRAMES; f++) {
    if (scenesAt(f).length === 0) uncovered.push(f);
  }
  assert.deepEqual(uncovered, []);
});

test("at most two scenes overlap at any frame, and overlap windows match", () => {
  let multi = 0;
  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const n = scenesAt(f).length;
    assert.ok(n <= 2, `frame ${f} has ${n} scenes`);
    if (n === 2) multi++;
  }
  const sum = overlaps().reduce((a, o) => a + (o.to - o.from), 0);
  assert.equal(multi, sum);
});

test("half-open boundaries: `to` frame belongs to the next scene only", () => {
  for (let i = 0; i < SCENES.length - 1; i++) {
    const s = SCENES[i];
    assert.ok(scenesAt(s.to - 1).includes(s), `${s.id} missing at to-1`);
    assert.ok(!scenesAt(s.to).includes(s), `${s.id} present at to`);
  }
  assert.ok(scenesAt(TOTAL_FRAMES - 1).some((s) => s.id === "S15"));
});

test("out-of-range frames are rejected", () => {
  for (const f of [-1, TOTAL_FRAMES, TOTAL_FRAMES + 1, 1.5, NaN]) {
    assert.throws(() => scenesAt(f), RangeError, String(f));
  }
});

test("scenesAt returns paint order by layer; layers are unique", () => {
  assert.equal(new Set(SCENES.map((s) => s.layer)).size, SCENES.length);
  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const ls = scenesAt(f).map((s) => s.layer);
    assert.deepEqual(ls, [...ls].sort((a, b) => a - b));
  }
});

test("global/local conversion round-trips", () => {
  for (const s of SCENES) {
    assert.equal(toLocal(s.id, s.from), 0);
    assert.equal(toGlobal(s.id, 0), s.from);
    assert.equal(toGlobal(s.id, toLocal(s.id, s.to - 1)), s.to - 1);
  }
});
