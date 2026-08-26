/**
 * main.ts — application entry point.
 *
 * Bootstraps the engine subsystems and kicks off the game loop.
 * This file should stay thin: system construction and wiring only.
 */

import { CanvasManager } from './core/CanvasManager';
import { FIXED_DELTA, MAX_STEPS_PER_FRAME } from './core/GameConfig';
import { GameLoop } from './core/GameLoop';

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

const canvasManager = new CanvasManager('game-canvas');
const gameLoop = new GameLoop({ fixedDelta: FIXED_DELTA, maxStepsPerFrame: MAX_STEPS_PER_FRAME });

// ---------------------------------------------------------------------------
// Placeholder update / render — replace with real systems as they are built.
// ---------------------------------------------------------------------------

function update(_fixedDelta: number): void {
  // TODO: tick physics, entities, terrain simulation
}

function render(_alpha: number): void {
  const ctx = canvasManager.context;
  const { width, height } = canvasManager;

  // Clear to cave-black each frame.
  canvasManager.clear('#111111');

  // TODO: draw terrain, entities, HUD
  // Placeholder: draw a centred "Boulder Dash" title so something visible appears.
  ctx.fillStyle = '#f5c518';
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Boulder Dash', width / 2, height / 2);

  ctx.fillStyle = '#888888';
  ctx.font = '20px monospace';
  ctx.fillText('engine running — alpha: ' + _alpha.toFixed(3), width / 2, height / 2 + 60);
}

// ---------------------------------------------------------------------------
// Handle page visibility changes (pause when tab is hidden, resume on focus)
// ---------------------------------------------------------------------------

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gameLoop.pause();
  } else {
    gameLoop.resume();
  }
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

gameLoop.start(update, render);
