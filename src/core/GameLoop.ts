/**
 * GameLoop — drives the simulation using a fixed-timestep update + variable
 * render approach (the "Fix Your Timestep" pattern by Glenn Fiedler).
 *
 * Key properties:
 *  - Physics/logic advances in discrete steps of `fixedDelta` seconds.
 *  - Rendering runs every animation frame and receives an interpolation factor
 *    (`alpha`) so it can smooth between two simulation states.
 *  - A `maxStepsPerFrame` cap prevents the "spiral of death" when frames are
 *    slow (e.g. tab hidden then foregrounded).
 *
 * Usage:
 *   const loop = new GameLoop({ fixedDelta: 1/60, maxStepsPerFrame: 5 });
 *   loop.start(
 *     (dt) => updateGame(dt),          // called N times with fixed dt
 *     (alpha) => renderGame(alpha),    // called once per RAF
 *   );
 */

export type UpdateFn = (fixedDelta: number) => void;
export type RenderFn = (alpha: number) => void;

export interface GameLoopOptions {
  /** Fixed simulation step in seconds (default 1/60). */
  fixedDelta?: number;
  /** Max simulation steps per frame (default 5). */
  maxStepsPerFrame?: number;
}

export class GameLoop {
  private readonly fixedDelta: number;
  private readonly maxStepsPerFrame: number;

  private rafHandle: number = 0;
  private previousTime: number = 0;
  private accumulator: number = 0;
  private isRunning: boolean = false;

  private updateFn: UpdateFn | null = null;
  private renderFn: RenderFn | null = null;

  /** Total elapsed simulation time in seconds. */
  private simulationTime: number = 0;

  constructor(options: GameLoopOptions = {}) {
    this.fixedDelta = options.fixedDelta ?? 1 / 60;
    this.maxStepsPerFrame = options.maxStepsPerFrame ?? 5;
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Start the loop.
   *
   * @param update - Called once per fixed simulation step.
   *                 Receives the fixed delta time in seconds.
   * @param render - Called once per animation frame.
   *                 Receives `alpha` ∈ [0, 1]: how far into the current
   *                 step we are, useful for sub-step interpolation.
   */
  start(update: UpdateFn, render: RenderFn): void {
    if (this.isRunning) return;

    this.updateFn = update;
    this.renderFn = render;
    this.isRunning = true;
    this.previousTime = performance.now();
    this.accumulator = 0;

    this.rafHandle = requestAnimationFrame(this.tick);
  }

  /** Pause the loop without losing accumulated time. */
  pause(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    cancelAnimationFrame(this.rafHandle);
  }

  /** Resume after a pause. Resets the previous-time stamp to avoid a
   *  large dt spike on the first resumed frame. */
  resume(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.previousTime = performance.now();
    this.rafHandle = requestAnimationFrame(this.tick);
  }

  /** Stop the loop completely and release callbacks. */
  stop(): void {
    this.pause();
    this.updateFn = null;
    this.renderFn = null;
    this.accumulator = 0;
    this.simulationTime = 0;
  }

  /** Whether the loop is currently ticking. */
  get running(): boolean {
    return this.isRunning;
  }

  /** Monotonically increasing simulation clock in seconds. */
  get elapsedTime(): number {
    return this.simulationTime;
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  /**
   * Core tick — bound as an arrow function so it retains `this` when passed
   * directly to requestAnimationFrame.
   */
  private readonly tick = (timestamp: number): void => {
    if (!this.isRunning) return;

    // Clamp the frame delta to avoid enormous spikes (e.g. after tab switch).
    const maxFrameDelta = this.fixedDelta * this.maxStepsPerFrame;
    const frameTime = Math.min((timestamp - this.previousTime) / 1_000, maxFrameDelta);
    this.previousTime = timestamp;

    this.accumulator += frameTime;

    // Run as many fixed steps as the accumulator allows.
    let steps = 0;
    while (this.accumulator >= this.fixedDelta && steps < this.maxStepsPerFrame) {
      this.updateFn?.(this.fixedDelta);
      this.simulationTime += this.fixedDelta;
      this.accumulator -= this.fixedDelta;
      steps++;
    }

    // Alpha: fractional progress into the next step [0, 1).
    const alpha = this.accumulator / this.fixedDelta;
    this.renderFn?.(alpha);

    this.rafHandle = requestAnimationFrame(this.tick);
  };
}
