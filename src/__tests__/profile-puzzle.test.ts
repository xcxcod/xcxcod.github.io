import { describe, expect, it } from "vitest";
import {
  applyLayerTurn,
  applyMove,
  applyMoves,
  createScramble,
  createSolvedCube,
  describeTurnForFace,
  generateScrambledCube,
  getSolutionTurnsFromScramble,
  getFaceStickers,
  getGestureTurn,
  initialScrambledCube,
  isSolvedCube,
  parseMove,
  solvedCube,
  turnsEqual
} from "@/features/profile-puzzle/puzzle-state";

describe("profile Rubik's Cube puzzle logic", () => {
  it("detects the solved cube", () => {
    expect(isSolvedCube(solvedCube)).toBe(true);
    expect(isSolvedCube(createSolvedCube())).toBe(true);
  });

  it("detects the initial scramble as unsolved", () => {
    expect(isSolvedCube(initialScrambledCube)).toBe(false);
  });

  it("applies valid moves and inverses without creating an impossible sticker set", () => {
    const moved = applyMove(solvedCube, "R");
    const restored = applyMove(moved, "R'");

    expect(isSolvedCube(moved)).toBe(false);
    expect(isSolvedCube(restored)).toBe(true);
    expect(new Set(moved.map((sticker) => sticker.id)).size).toBe(54);
  });

  it("supports double turns", () => {
    const moved = applyMoves(solvedCube, ["U2", "U2"]);
    expect(isSolvedCube(moved)).toBe(true);
  });

  it("generates scrambles by applying legal moves from a solved cube", () => {
    const scrambled = generateScrambledCube(5);

    expect(scrambled).toHaveLength(54);
    expect(isSolvedCube(scrambled)).toBe(false);
    expect(getFaceStickers(scrambled, "F")).toHaveLength(9);
  });

  it("defaults to an easy scramble that is only a few moves from solved", () => {
    const easy = createScramble("easy");

    expect(easy.sequence.length).toBeGreaterThanOrEqual(3);
    expect(easy.sequence.length).toBeLessThanOrEqual(5);
    expect(isSolvedCube(easy.cube)).toBe(false);
    expect(isSolvedCube(applyLayerTurnsForTest(easy.cube, getSolutionTurnsFromScramble(easy.sequence)))).toBe(true);
  });

  it("supports a normal scramble without using a competition-length sequence", () => {
    const normal = createScramble("normal");

    expect(normal.sequence.length).toBeGreaterThanOrEqual(8);
    expect(normal.sequence.length).toBeLessThanOrEqual(12);
    expect(isSolvedCube(normal.cube)).toBe(false);
  });

  it("maps a surface row drag to a real layer turn", () => {
    const turn = getGestureTurn("F", 0, 1, 48, 4);

    expect(turn).toEqual({ axis: "y", layer: 1, turns: -1 });
    expect(isSolvedCube(applyLayerTurn(solvedCube, turn!))).toBe(false);
  });

  it("maps a surface column drag to a real layer turn", () => {
    const turn = getGestureTurn("F", 1, 2, 2, -48);

    expect(turn).toEqual({ axis: "x", layer: 1, turns: -1 });
    expect(isSolvedCube(applyLayerTurn(solvedCube, turn!))).toBe(false);
  });

  it("ignores tiny accidental drags", () => {
    expect(getGestureTurn("F", 1, 1, 8, 3)).toBeNull();
  });

  it("parses standard Rubik notation", () => {
    expect(parseMove("F")).toEqual({ axis: "z", layer: 1, turns: -1 });
    expect(parseMove("F'")).toEqual({ axis: "z", layer: 1, turns: 1 });
    expect(parseMove("F2")).toEqual({ axis: "z", layer: 1, turns: 2 });
  });

  it("describes a hinted move without requiring Rubik notation", () => {
    const hint = describeTurnForFace("F", parseMove("U"));

    expect(hint.text).toMatch(/row/);
    expect(hint.text).not.toMatch(/U'?2?/);
  });

  it("compares turns for hint progress", () => {
    expect(turnsEqual(parseMove("R"), parseMove("R"))).toBe(true);
    expect(turnsEqual(parseMove("R"), parseMove("R'"))).toBe(false);
  });
});

function applyLayerTurnsForTest(cube: typeof solvedCube, turns: ReturnType<typeof getSolutionTurnsFromScramble>) {
  return turns.reduce((current, turn) => applyLayerTurn(current, turn), cube);
}
