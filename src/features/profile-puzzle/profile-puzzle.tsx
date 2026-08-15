"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  applyLayerTurn,
  createScramble,
  describeTurnForFace,
  faceConfigs,
  getFaceStickers,
  getGestureTurn,
  initialScrambledCube,
  initialScrambleTurns,
  getSolutionTurnsFromScramble,
  invertTurn,
  isSolvedCube,
  turnsEqual
} from "@/features/profile-puzzle/puzzle-state";
import type { CubeColor, CubeState, Difficulty, FaceName, LayerTurn } from "@/features/profile-puzzle/puzzle-state";
import { cn } from "@/lib/utils";

const faceOrder: FaceName[] = ["F", "R", "B", "L", "U", "D"];

const stickerStyles: Record<CubeColor, CSSProperties> = {
  white: {
    backgroundColor: "#f8fafc",
    boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.16), inset 0 -14px 24px rgba(15,23,42,0.10)"
  },
  yellow: {
    backgroundColor: "#ffd500",
    boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.18), inset 0 -14px 24px rgba(104,72,0,0.18)"
  },
  red: {
    backgroundColor: "#c41e3a",
    boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.20), inset 0 -14px 24px rgba(44,0,0,0.22)"
  },
  orange: {
    backgroundColor: "#ff5800",
    boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.20), inset 0 -14px 24px rgba(70,24,0,0.22)"
  },
  blue: {
    backgroundColor: "#0051ba",
    boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.20), inset 0 -14px 24px rgba(0,13,46,0.24)"
  },
  green: {
    backgroundColor: "#009e60",
    boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.20), inset 0 -14px 24px rgba(0,44,24,0.22)"
  }
};

type DragStart = {
  pointerId: number;
  x: number;
  y: number;
  row: number;
  col: number;
};

type MoveHistoryEntry = {
  turn: LayerTurn;
  previousSolution: LayerTurn[];
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function cellFromIndex(index: number) {
  return {
    row: Math.floor(index / 3),
    col: index % 3
  };
}

function animationClass(animation: { row: number | null; col: number | null; horizontal: boolean; direction: number } | null, row: number, col: number) {
  if (!animation) return "";

  const affected = animation.horizontal ? animation.row === row : animation.col === col;
  if (!affected) return "";

  if (animation.horizontal) {
    return animation.direction > 0 ? "translate-x-3" : "-translate-x-3";
  }

  return animation.direction > 0 ? "translate-y-3" : "-translate-y-3";
}

export function ProfilePuzzle({ imageUrl, alt }: { imageUrl?: string; alt: string }) {
  const initialCube = useMemo(() => initialScrambledCube, []);
  const initialSolutionTurns = useMemo(() => getSolutionTurnsFromScramble(initialScrambleTurns), []);
  const [originalCube, setOriginalCube] = useState<CubeState>(initialCube);
  const [originalSolutionTurns, setOriginalSolutionTurns] = useState<LayerTurn[]>(initialSolutionTurns);
  const [cube, setCube] = useState<CubeState>(initialCube);
  const [currentFace, setCurrentFace] = useState<FaceName>("F");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [solutionTurns, setSolutionTurns] = useState<LayerTurn[]>(initialSolutionTurns);
  const [moveHistory, setMoveHistory] = useState<MoveHistoryEntry[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [solved, setSolved] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pendingTurn, setPendingTurn] = useState<LayerTurn | null>(null);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number; horizontal: boolean } | null>(null);
  const [animation, setAnimation] = useState<{ row: number | null; col: number | null; horizontal: boolean; direction: number } | null>(null);
  const [hint, setHint] = useState<ReturnType<typeof describeTurnForFace> | null>(null);
  const dragStart = useRef<DragStart | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);

    function handleChange(event: MediaQueryListEvent) {
      setReducedMotion(event.matches);
    }

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!timerRunning) return;

    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning]);

  const visibleStickers = getFaceStickers(cube, currentFace);
  const progressLabel = solved || revealed ? "Solved" : solutionTurns.length <= 2 ? "Almost solved" : "Ready";

  function revealPhoto(nextSolved = false) {
    setTimerRunning(false);
    setSolved(nextSolved);
    window.setTimeout(() => setRevealed(true), reducedMotion ? 40 : 260);
  }

  function completeTurn(turn: LayerTurn, row: number, col: number, horizontal: boolean, direction: number) {
    if (revealed || solved || pendingTurn) return;

    if (moves === 0) setTimerRunning(true);

    const previousSolution = solutionTurns;
    const nextSolution = turnsEqual(turn, previousSolution[0]) ? previousSolution.slice(1) : [invertTurn(turn), ...previousSolution];

    setPendingTurn(turn);
    setAnimation({ row: horizontal ? row : null, col: horizontal ? null : col, horizontal, direction });

    window.setTimeout(() => {
      setCube((current) => {
        const next = applyLayerTurn(current, turn);
        if (isSolvedCube(next)) revealPhoto(true);
        return next;
      });
      setSolutionTurns(nextSolution);
      setMoveHistory((current) => [...current.slice(-31), { turn, previousSolution }]);
      setMoves((value) => value + 1);
      setPendingTurn(null);
      setAnimation(null);
      setActiveCell(null);
      setHint(null);
    }, reducedMotion ? 0 : 180);
  }

  function handlePointerDown(index: number, event: React.PointerEvent<HTMLButtonElement>) {
    if (revealed || solved || pendingTurn) return;

    const { row, col } = cellFromIndex(index);
    dragStart.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      row,
      col
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragStart.current || pendingTurn) return;

    const deltaX = event.clientX - dragStart.current.x;
    const deltaY = event.clientY - dragStart.current.y;
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) return;

    setActiveCell({
      row: dragStart.current.row,
      col: dragStart.current.col,
      horizontal: Math.abs(deltaX) >= Math.abs(deltaY)
    });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    const start = dragStart.current;
    dragStart.current = null;
    setActiveCell(null);

    if (!start || pendingTurn || revealed || solved) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const turn = getGestureTurn(currentFace, start.row, start.col, deltaX, deltaY);
    if (!turn) return;

    completeTurn(turn, start.row, start.col, Math.abs(deltaX) >= Math.abs(deltaY), Math.abs(deltaX) >= Math.abs(deltaY) ? Math.sign(deltaX) : Math.sign(deltaY));
  }

  function handlePointerCancel() {
    dragStart.current = null;
    setActiveCell(null);
  }

  function handleStickerKey(index: number, key: string) {
    if (key !== "Enter" && key !== " ") return;

    const { row, col } = cellFromIndex(index);
    const turn = getGestureTurn(currentFace, row, col, 42, 0);
    if (turn) completeTurn(turn, row, col, true, 1);
  }

  function resetPuzzle() {
    setCube(originalCube);
    setSolutionTurns(originalSolutionTurns);
    setMoveHistory([]);
    setCurrentFace("F");
    setMoves(0);
    setSeconds(0);
    setTimerRunning(false);
    setSolved(false);
    setRevealed(false);
    setPendingTurn(null);
    setHint(null);
  }

  function startScramble(nextDifficulty = difficulty) {
    const next = createScramble(nextDifficulty);
    const nextSolution = getSolutionTurnsFromScramble(next.sequence);
    setOriginalCube(next.cube);
    setOriginalSolutionTurns(nextSolution);
    setCube(next.cube);
    setSolutionTurns(nextSolution);
    setMoveHistory([]);
    setCurrentFace("F");
    setMoves(0);
    setSeconds(0);
    setTimerRunning(false);
    setSolved(false);
    setRevealed(false);
    setPendingTurn(null);
    setHint(null);
  }

  function scramblePuzzle() {
    startScramble();
  }

  function changeDifficulty(nextDifficulty: Difficulty) {
    setDifficulty(nextDifficulty);
    startScramble(nextDifficulty);
  }

  function handleDifficultyKey(nextDifficulty: Difficulty, key: string) {
    if (key !== "Enter" && key !== " ") return;
    changeDifficulty(nextDifficulty);
  }

  function showHint() {
    const nextTurn = solutionTurns[0];
    if (!nextTurn || solved || revealed) {
      setHint({ row: null, col: null, horizontal: true, text: "The cube is already solved." });
      return;
    }

    setHint(describeTurnForFace(currentFace, nextTurn));
  }

  function undoMove() {
    if (revealed || solved || pendingTurn || moveHistory.length === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    const undoTurn = invertTurn(lastMove.turn);
    setCube((current) => applyLayerTurn(current, undoTurn));
    setMoveHistory((current) => current.slice(0, -1));
    setSolutionTurns(lastMove.previousSolution);
    setMoves((value) => Math.max(0, value - 1));
    setHint(null);
  }

  function rotateFace() {
    setCurrentFace((face) => faceOrder[(faceOrder.indexOf(face) + 1) % faceOrder.length]);
  }

  if (!imageUrl) {
    return (
      <div className="mx-auto max-w-[24rem] lg:max-w-none">
        <div className="aspect-[4/4.45] overflow-hidden rounded-[2rem] bg-slate-100 shadow-[18px_18px_0_rgba(23,32,51,0.08)] dark:bg-slate-900">
          <div className="image-noise flex h-full items-center justify-center p-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-500">YOUR_PROFILE_IMAGE</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[24rem] lg:max-w-none">
      <div className="mb-3 grid gap-3 font-mono uppercase text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <span className="text-[0.72rem] tracking-[0.18em] text-ink dark:text-white">
            {revealed ? "Profile revealed" : solved ? "Solved" : "Solve to reveal me."}
          </span>
          <span className="text-right text-[0.68rem] tracking-[0.14em]">Moves: {moves} <span className="mx-1 text-slate-300 dark:text-slate-600">/</span> Time: {formatTime(seconds)}</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1 border border-ink/10 p-1 dark:border-white/10" aria-label="Rubik's Cube difficulty">
            {(["easy", "normal"] as Difficulty[]).map((level) => (
              <button
                key={level}
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault();
                  changeDifficulty(level);
                }}
                onKeyDown={(event) => handleDifficultyKey(level, event.key)}
                className={cn(
                  "min-h-8 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] transition",
                  difficulty === level ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-slate-500 hover:text-accent dark:text-slate-400"
                )}
                aria-label={`Set Rubik's Cube difficulty to ${level}`}
                aria-pressed={difficulty === level}
              >
                {level}
              </button>
            ))}
          </div>
          <span className="text-[0.65rem] tracking-[0.14em]">{progressLabel}</span>
        </div>
      </div>

      <div className="relative aspect-[4/4.45] overflow-hidden rounded-[2rem] bg-slate-950 p-3 shadow-[18px_18px_0_rgba(23,32,51,0.08)] dark:bg-black/80 sm:p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={alt}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-top transition duration-500",
            revealed ? "scale-100 opacity-100" : "scale-[1.015] opacity-0"
          )}
        />

        <div
          className={cn(
            "absolute inset-4 flex items-center justify-center transition duration-300",
            revealed && "pointer-events-none opacity-0",
            reducedMotion && "transition-none"
          )}
          aria-label="Interactive Rubik's Cube profile puzzle"
        >
          <div className="relative w-full max-w-[96%] min-w-0">
            <div className="mb-3 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/55">
              <span>{faceConfigs[currentFace].label} face</span>
              <button type="button" onClick={rotateFace} className="text-white/65 transition hover:text-white" aria-label="Show another Rubik's Cube face">
                Change Face
              </button>
            </div>
            <div className="grid aspect-square w-full min-w-0 grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(3,minmax(0,1fr))] gap-1 rounded-lg bg-black p-1 shadow-[0_22px_50px_rgba(0,0,0,0.35)]">
              {visibleStickers.map((sticker, index) => {
                const { row, col } = cellFromIndex(index);
                const highlighted = activeCell && (activeCell.horizontal ? activeCell.row === row : activeCell.col === col);
                const hinted = hint && (hint.horizontal ? hint.row === row : hint.col === col);

                return (
                  <button
                    key={sticker?.id ?? index}
                    type="button"
                    onPointerDown={(event) => handlePointerDown(index, event)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                    onKeyDown={(event) => handleStickerKey(index, event.key)}
                    disabled={revealed || solved || Boolean(pendingTurn)}
                    className={cn(
                      "relative min-h-0 min-w-0 touch-none rounded-[0.45rem] border border-black/60 transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black disabled:cursor-wait",
                      highlighted && "scale-[0.98] brightness-110",
                      hinted && "ring-2 ring-accent ring-offset-2 ring-offset-black",
                      animationClass(animation, row, col),
                      reducedMotion && "transition-none"
                    )}
                    style={sticker ? stickerStyles[sticker.color] : undefined}
                    aria-label={`Turn ${faceConfigs[currentFace].label} face sticker row ${row + 1} column ${col + 1}`}
                  >
                    <span className="pointer-events-none absolute inset-x-3 top-3 h-px bg-white/35" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {solved && !revealed ? (
          <div className="absolute inset-x-0 bottom-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-accent dark:text-teal-300">Solved</div>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={showHint} aria-label="Show Rubik's Cube hint" className="min-h-10 border border-ink/15 px-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-accent hover:text-accent dark:border-white/15 dark:text-slate-200">
            Hint
          </button>
          <button type="button" onClick={undoMove} disabled={moveHistory.length === 0 || Boolean(pendingTurn)} aria-label="Undo last Rubik's Cube move" className="min-h-10 border border-ink/15 px-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:border-ink/5 disabled:text-slate-400 dark:border-white/15 dark:text-slate-200 dark:disabled:border-white/10 dark:disabled:text-slate-600">
            Undo
          </button>
          <button type="button" onClick={resetPuzzle} aria-label="Reset Rubik's Cube puzzle" className="min-h-10 border border-ink/15 px-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-accent hover:text-accent dark:border-white/15 dark:text-slate-200">
            Reset
          </button>
        </div>
        <div className="grid grid-cols-[1fr_1.25fr] gap-2">
          <button type="button" onClick={revealed ? scramblePuzzle : scramblePuzzle} aria-label="Scramble Rubik's Cube puzzle" className="min-h-10 px-2 text-left font-mono text-xs uppercase tracking-[0.15em] text-slate-500 transition hover:text-accent dark:text-slate-400">
            {revealed ? "Play Again" : "Scramble"}
          </button>
          <button type="button" onClick={() => revealPhoto(false)} aria-label="Reveal profile photo" className="min-h-10 border border-accent/35 bg-accent/10 px-3 text-right font-mono text-xs font-semibold uppercase tracking-[0.15em] text-accent transition hover:bg-accent hover:text-white dark:border-teal-300/35 dark:bg-teal-300/10 dark:text-teal-300 dark:hover:bg-teal-300 dark:hover:text-ink">
            Reveal Photo
          </button>
        </div>
        <button type="button" onClick={() => setHelpOpen((value) => !value)} aria-expanded={helpOpen} className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-slate-500 transition hover:text-accent dark:text-slate-400">
          Help
        </button>
      </div>

      {helpOpen ? (
        <div className="mt-3 border border-ink/10 bg-white/45 p-3 font-mono text-[0.68rem] uppercase leading-5 tracking-[0.12em] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          <p>Drag a row left or right. Drag a column up or down. Use Change Face to inspect another side.</p>
          <p className="mt-2 text-accent dark:text-teal-300">{solutionTurns.length} helpful moves remain on the suggested path.</p>
        </div>
      ) : null}
      {hint ? (
        <p className="mt-3 max-w-sm font-mono text-[0.68rem] uppercase leading-5 tracking-[0.12em] text-accent dark:text-teal-300" role="status">
          {moves >= 4 && !solved ? "Need a hint? " : ""}{hint.text}
        </p>
      ) : null}
    </div>
  );
}
