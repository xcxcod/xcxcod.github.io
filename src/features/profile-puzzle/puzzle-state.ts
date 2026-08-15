export type Axis = "x" | "y" | "z";
export type FaceName = "U" | "D" | "L" | "R" | "F" | "B";
export type CubeColor = "white" | "yellow" | "red" | "orange" | "blue" | "green";
export type Vector3 = { x: number; y: number; z: number };
export type AxisVector = { axis: Axis; sign: 1 | -1 };

export type Sticker = {
  id: string;
  face: FaceName;
  color: CubeColor;
  coord: Vector3;
  normal: Vector3;
  homeCoord: Vector3;
  homeNormal: Vector3;
};

export type CubeState = Sticker[];

export type FaceConfig = {
  face: FaceName;
  label: string;
  normal: Vector3;
  right: AxisVector;
  up: AxisVector;
};

export type LayerTurn = {
  axis: Axis;
  layer: -1 | 0 | 1;
  turns: -1 | 1 | 2;
};

export type Difficulty = "easy" | "normal";

export type ScrambleResult = {
  cube: CubeState;
  sequence: LayerTurn[];
  moveLabels: string[];
};

const faceColors: Record<FaceName, CubeColor> = {
  U: "white",
  D: "yellow",
  F: "red",
  B: "orange",
  R: "blue",
  L: "green"
};

export const faceConfigs: Record<FaceName, FaceConfig> = {
  F: { face: "F", label: "Front", normal: { x: 0, y: 0, z: 1 }, right: { axis: "x", sign: 1 }, up: { axis: "y", sign: 1 } },
  B: { face: "B", label: "Back", normal: { x: 0, y: 0, z: -1 }, right: { axis: "x", sign: -1 }, up: { axis: "y", sign: 1 } },
  U: { face: "U", label: "Top", normal: { x: 0, y: 1, z: 0 }, right: { axis: "x", sign: 1 }, up: { axis: "z", sign: -1 } },
  D: { face: "D", label: "Bottom", normal: { x: 0, y: -1, z: 0 }, right: { axis: "x", sign: 1 }, up: { axis: "z", sign: 1 } },
  R: { face: "R", label: "Right", normal: { x: 1, y: 0, z: 0 }, right: { axis: "z", sign: -1 }, up: { axis: "y", sign: 1 } },
  L: { face: "L", label: "Left", normal: { x: -1, y: 0, z: 0 }, right: { axis: "z", sign: 1 }, up: { axis: "y", sign: 1 } }
};

const standardMoves: Record<string, LayerTurn> = {
  U: { axis: "y", layer: 1, turns: -1 },
  D: { axis: "y", layer: -1, turns: 1 },
  R: { axis: "x", layer: 1, turns: 1 },
  L: { axis: "x", layer: -1, turns: -1 },
  F: { axis: "z", layer: 1, turns: -1 },
  B: { axis: "z", layer: -1, turns: 1 }
};

const initialScrambleMoves = ["R", "U", "F'", "L"];

const scrambleRanges: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 3, max: 5 },
  normal: { min: 8, max: 12 }
};

function vectorEquals(a: Vector3, b: Vector3) {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}

function valueForAxis(vector: Vector3, axis: Axis) {
  return vector[axis];
}

function cloneVector(vector: Vector3): Vector3 {
  return { x: vector.x, y: vector.y, z: vector.z };
}

function rotateVectorQuarter(vector: Vector3, axis: Axis): Vector3 {
  if (axis === "x") return { x: vector.x, y: -vector.z, z: vector.y };
  if (axis === "y") return { x: vector.z, y: vector.y, z: -vector.x };
  return { x: -vector.y, y: vector.x, z: vector.z };
}

function rotateVector(vector: Vector3, axis: Axis, turns: LayerTurn["turns"]) {
  const quarterTurns = turns === 2 ? 2 : turns === 1 ? 1 : 3;
  let next = cloneVector(vector);

  for (let index = 0; index < quarterTurns; index += 1) {
    next = rotateVectorQuarter(next, axis);
  }

  return next;
}

function signedTurn(value: number): -1 | 1 {
  return value < 0 ? -1 : 1;
}

function createFace(face: FaceName, normal: Vector3, right: AxisVector, up: AxisVector) {
  const stickers: Sticker[] = [];

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const coord = cloneVector(normal);
      coord[right.axis] = right.sign * (col - 1);
      coord[up.axis] = up.sign * (1 - row);

      stickers.push({
        id: `${face}-${row}-${col}`,
        face,
        color: faceColors[face],
        coord,
        normal: cloneVector(normal),
        homeCoord: cloneVector(coord),
        homeNormal: cloneVector(normal)
      });
    }
  }

  return stickers;
}

export function createSolvedCube(): CubeState {
  return (Object.keys(faceConfigs) as FaceName[]).flatMap((face) => {
    const config = faceConfigs[face];
    return createFace(face, config.normal, config.right, config.up);
  });
}

export const solvedCube = createSolvedCube();
export const initialScrambledCube = applyMoves(solvedCube, initialScrambleMoves);
export const initialScrambleTurns = initialScrambleMoves.map(parseMove);

export function applyLayerTurn(cube: CubeState, turn: LayerTurn): CubeState {
  return cube.map((sticker) => {
    if (valueForAxis(sticker.coord, turn.axis) !== turn.layer) return { ...sticker, coord: cloneVector(sticker.coord), normal: cloneVector(sticker.normal) };

    return {
      ...sticker,
      coord: rotateVector(sticker.coord, turn.axis, turn.turns),
      normal: rotateVector(sticker.normal, turn.axis, turn.turns)
    };
  });
}

export function parseMove(move: string): LayerTurn {
  const face = move[0];
  const base = standardMoves[face];
  if (!base) throw new Error(`Unsupported Rubik move: ${move}`);

  if (move.endsWith("2")) return { ...base, turns: 2 };
  if (move.endsWith("'")) return { ...base, turns: base.turns === 1 ? -1 : 1 };
  return { ...base };
}

export function applyMove(cube: CubeState, move: string): CubeState {
  return applyLayerTurn(cube, parseMove(move));
}

export function applyMoves(cube: CubeState, moves: string[]): CubeState {
  return moves.reduce((current, move) => applyMove(current, move), cloneCube(cube));
}

export function applyLayerTurns(cube: CubeState, turns: LayerTurn[]): CubeState {
  return turns.reduce((current, turn) => applyLayerTurn(current, turn), cloneCube(cube));
}

export function cloneCube(cube: CubeState): CubeState {
  return cube.map((sticker) => ({
    ...sticker,
    coord: cloneVector(sticker.coord),
    normal: cloneVector(sticker.normal),
    homeCoord: cloneVector(sticker.homeCoord),
    homeNormal: cloneVector(sticker.homeNormal)
  }));
}

export function isSolvedCube(cube: CubeState) {
  return cube.every((sticker) => vectorEquals(sticker.coord, sticker.homeCoord) && vectorEquals(sticker.normal, sticker.homeNormal));
}

export function getFaceStickers(cube: CubeState, face: FaceName) {
  const config = faceConfigs[face];
  const stickers = cube.filter((sticker) => vectorEquals(sticker.normal, config.normal));
  const cells: Array<Sticker | undefined> = Array.from({ length: 9 });

  stickers.forEach((sticker) => {
    const col = valueForAxis(sticker.coord, config.right.axis) * config.right.sign + 1;
    const row = 1 - valueForAxis(sticker.coord, config.up.axis) * config.up.sign;
    cells[row * 3 + col] = sticker;
  });

  return cells;
}

export function invertTurn(turn: LayerTurn): LayerTurn {
  return {
    ...turn,
    turns: turn.turns === 2 ? 2 : turn.turns === 1 ? -1 : 1
  };
}

export function turnsEqual(a: LayerTurn | undefined, b: LayerTurn | undefined) {
  return Boolean(a && b && a.axis === b.axis && a.layer === b.layer && a.turns === b.turns);
}

export function getSolutionTurnsFromScramble(sequence: LayerTurn[]) {
  return [...sequence].reverse().map(invertTurn);
}

export function getDifficultyMoveCount(difficulty: Difficulty) {
  const range = scrambleRanges[difficulty];
  return range.min + Math.floor(Math.random() * (range.max - range.min + 1));
}

export function generateScrambleSequence(difficulty: Difficulty = "easy") {
  const moveCount = getDifficultyMoveCount(difficulty);
  const moves = Object.keys(standardMoves);
  const suffixes = ["", "'"];
  const labels: string[] = [];
  let previousFace = "";

  for (let index = 0; index < moveCount; index += 1) {
    const candidates = moves.filter((move) => move !== previousFace);
    const face = candidates[Math.floor(Math.random() * candidates.length)] ?? "R";
    previousFace = face;
    labels.push(`${face}${suffixes[Math.floor(Math.random() * suffixes.length)] ?? ""}`);
  }

  return labels;
}

export function createScramble(difficulty: Difficulty = "easy"): ScrambleResult {
  const moveLabels = generateScrambleSequence(difficulty);
  const sequence = moveLabels.map(parseMove);
  const cube = applyLayerTurns(solvedCube, sequence);

  if (isSolvedCube(cube)) {
    const fallback = [...sequence, parseMove("R")];
    return {
      cube: applyLayerTurns(solvedCube, fallback),
      sequence: fallback,
      moveLabels: [...moveLabels, "R"]
    };
  }

  return { cube, sequence, moveLabels };
}

export function generateScrambledCube(moveCount = 5) {
  const moves = Object.keys(standardMoves);
  const suffixes = ["", "'"];
  const sequence: string[] = [];
  let previousFace = "";

  for (let index = 0; index < moveCount; index += 1) {
    const candidates = moves.filter((move) => move !== previousFace);
    const face = candidates[Math.floor(Math.random() * candidates.length)] ?? "R";
    previousFace = face;
    sequence.push(`${face}${suffixes[Math.floor(Math.random() * suffixes.length)] ?? ""}`);
  }

  const cube = applyMoves(solvedCube, sequence);
  return isSolvedCube(cube) ? applyMove(cube, "R") : cube;
}

export function describeTurnForFace(face: FaceName, turn: LayerTurn) {
  const config = faceConfigs[face];
  const layerNames = ["bottom", "middle", "top"];
  const columnNames = ["left", "middle", "right"];

  if (turn.axis === config.up.axis) {
    const visibleLayer = turn.layer * config.up.sign;
    const row = 1 - visibleLayer;
    const direction = turn.turns === -config.up.sign ? "right" : "left";
    const count = turn.turns === 2 ? " twice" : "";
    return {
      row,
      col: null,
      horizontal: true,
      text: `Move ${layerNames[row]} row ${direction}${count}.`
    };
  }

  if (turn.axis === config.right.axis) {
    const visibleLayer = turn.layer * config.right.sign;
    const col = visibleLayer + 1;
    const direction = turn.turns === config.right.sign ? "down" : "up";
    const count = turn.turns === 2 ? " twice" : "";
    return {
      row: null,
      col,
      horizontal: false,
      text: `Move ${columnNames[col]} column ${direction}${count}.`
    };
  }

  return {
    row: null,
    col: null,
    horizontal: true,
    text: `Change Face to line up the next helpful move.`
  };
}

export function getGestureTurn(face: FaceName, row: number, col: number, deltaX: number, deltaY: number): LayerTurn | null {
  if (Math.abs(deltaX) < 18 && Math.abs(deltaY) < 18) return null;

  const config = faceConfigs[face];

  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    const visibleLayer = (1 - row) as -1 | 0 | 1;
    return {
      axis: config.up.axis,
      layer: (visibleLayer * config.up.sign) as -1 | 0 | 1,
      turns: signedTurn(deltaX > 0 ? -config.up.sign : config.up.sign)
    };
  }

  const visibleLayer = (col - 1) as -1 | 0 | 1;
  return {
    axis: config.right.axis,
    layer: (visibleLayer * config.right.sign) as -1 | 0 | 1,
    turns: signedTurn(deltaY > 0 ? config.right.sign : -config.right.sign)
  };
}
