/**
 * GameConfig — centralised constants for the entire game.
 *
 * All "magic numbers" live here. Import from this module rather than
 * hard-coding values anywhere else.
 */

// ---------------------------------------------------------------------------
// Tile / world
// ---------------------------------------------------------------------------

/** Width and height of a single tile in logical (CSS) pixels. */
export const TILE_SIZE = 32;

/** Number of tile columns in the default level. */
export const MAP_COLS = 40;

/** Number of tile rows in the default level. */
export const MAP_ROWS = 22;

/** Logical canvas width derived from the tile grid. */
export const CANVAS_LOGICAL_WIDTH = TILE_SIZE * MAP_COLS; // 1280

/** Logical canvas height derived from the tile grid. */
export const CANVAS_LOGICAL_HEIGHT = TILE_SIZE * MAP_ROWS; // 704

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

/**
 * Gravity acceleration in pixels-per-second² applied to falling objects
 * (boulders, diamonds, player when unsupported).
 */
export const GRAVITY = 980;

/** Terminal velocity cap for falling objects in pixels-per-second. */
export const TERMINAL_VELOCITY = 800;

/** Horizontal friction coefficient (0 = no friction, 1 = instant stop). */
export const FRICTION = 0.8;

// ---------------------------------------------------------------------------
// Game loop
// ---------------------------------------------------------------------------

/** Target simulation steps per second (fixed-timestep). */
export const TARGET_FPS = 60;

/** Fixed delta time per simulation step in seconds. */
export const FIXED_DELTA = 1 / TARGET_FPS;

/** Maximum number of simulation steps per rendered frame to avoid a
 *  "spiral of death" if a frame takes too long. */
export const MAX_STEPS_PER_FRAME = 5;

// ---------------------------------------------------------------------------
// Player
// ---------------------------------------------------------------------------

/** Player move speed in pixels-per-second. */
export const PLAYER_SPEED = TILE_SIZE * 5; // 160 px/s

/** Worm dig radius in pixels (Worms-style terrain destruction). */
export const DIG_RADIUS = TILE_SIZE * 1.5; // 48 px

// ---------------------------------------------------------------------------
// Camera
// ---------------------------------------------------------------------------

/** How tightly the camera follows the player (0 = instant, 1 = never). */
export const CAMERA_LERP = 0.1;

// ---------------------------------------------------------------------------
// Type helpers
// ---------------------------------------------------------------------------

/** Immutable snapshot of all config values, useful for passing to systems. */
export interface GameConfigSnapshot {
  readonly tileSize: number;
  readonly mapCols: number;
  readonly mapRows: number;
  readonly canvasLogicalWidth: number;
  readonly canvasLogicalHeight: number;
  readonly gravity: number;
  readonly terminalVelocity: number;
  readonly friction: number;
  readonly targetFps: number;
  readonly fixedDelta: number;
  readonly maxStepsPerFrame: number;
  readonly playerSpeed: number;
  readonly digRadius: number;
  readonly cameraLerp: number;
}

export const GAME_CONFIG: GameConfigSnapshot = {
  tileSize: TILE_SIZE,
  mapCols: MAP_COLS,
  mapRows: MAP_ROWS,
  canvasLogicalWidth: CANVAS_LOGICAL_WIDTH,
  canvasLogicalHeight: CANVAS_LOGICAL_HEIGHT,
  gravity: GRAVITY,
  terminalVelocity: TERMINAL_VELOCITY,
  friction: FRICTION,
  targetFps: TARGET_FPS,
  fixedDelta: FIXED_DELTA,
  maxStepsPerFrame: MAX_STEPS_PER_FRAME,
  playerSpeed: PLAYER_SPEED,
  digRadius: DIG_RADIUS,
  cameraLerp: CAMERA_LERP,
} as const;
