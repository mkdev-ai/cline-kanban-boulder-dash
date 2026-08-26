/**
 * CanvasManager — owns the HTMLCanvasElement and its 2-D rendering context.
 *
 * Responsibilities:
 *  - Scale the backing-store to window.devicePixelRatio so rendering is sharp
 *    on HiDPI / Retina displays.
 *  - Listen for window resize events and re-apply the scaling transform.
 *  - Expose the context and logical dimensions to the rest of the engine.
 */

export interface CanvasSize {
  /** Logical (CSS) width in pixels. */
  readonly width: number;
  /** Logical (CSS) height in pixels. */
  readonly height: number;
  /** Physical pixel ratio (window.devicePixelRatio). */
  readonly dpr: number;
}

export class CanvasManager {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private size: CanvasSize;
  private readonly resizeObserver: ResizeObserver;

  constructor(canvasId: string) {
    const element = document.getElementById(canvasId);
    if (!(element instanceof HTMLCanvasElement)) {
      throw new Error(`CanvasManager: element with id "${canvasId}" is not a <canvas>.`);
    }
    this.canvas = element;

    const context = this.canvas.getContext('2d');
    if (context === null) {
      throw new Error('CanvasManager: failed to get 2D rendering context.');
    }
    this.ctx = context;

    // Initialise size with a sentinel — applySize will set the real values.
    this.size = { width: 0, height: 0, dpr: 1 };
    this.applySize();

    // ResizeObserver fires when the canvas CSS size changes (window resize,
    // orientation change, etc.) without us needing to poll window dimensions.
    this.resizeObserver = new ResizeObserver(() => {
      this.applySize();
    });
    this.resizeObserver.observe(this.canvas);
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /** The 2-D rendering context, pre-scaled to the device pixel ratio. */
  get context(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /** Current logical (CSS-pixel) dimensions and DPR. */
  get currentSize(): CanvasSize {
    return this.size;
  }

  /** Logical width in CSS pixels. */
  get width(): number {
    return this.size.width;
  }

  /** Logical height in CSS pixels. */
  get height(): number {
    return this.size.height;
  }

  /**
   * Clear the entire canvas to a solid colour.
   * Call this at the start of each render phase.
   */
  clear(fillStyle: string = '#000000'): void {
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(0, 0, this.size.width, this.size.height);
  }

  /**
   * Stop observing resize events.  Call this if the canvas is ever removed
   * from the DOM.
   */
  destroy(): void {
    this.resizeObserver.disconnect();
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Read the canvas element's current CSS dimensions and (re-)size the
   * backing store so that one logical pixel maps to `dpr` physical pixels.
   * Then reset the context transform to account for the scaling.
   */
  private applySize(): void {
    const dpr = window.devicePixelRatio;
    const cssWidth = this.canvas.clientWidth;
    const cssHeight = this.canvas.clientHeight;

    // Avoid unnecessary redraws when nothing has changed.
    if (this.size.width === cssWidth && this.size.height === cssHeight && this.size.dpr === dpr) {
      return;
    }

    // Set the physical (backing-store) dimensions.
    this.canvas.width = Math.round(cssWidth * dpr);
    this.canvas.height = Math.round(cssHeight * dpr);

    // Scale the context so all draw calls use logical pixels.
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.size = { width: cssWidth, height: cssHeight, dpr };
  }
}
