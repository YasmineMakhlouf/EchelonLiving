/**
 * DesignStudio
 * Frontend pages module for Echelon Living app.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { submitDesignRequest } from "../services/designService";
import "../../../styles/DesignStudio.css";

type BrushColor = "#111827" | "#f59e0b" | "#ec4899" | "#8b5cf6" | "#22c55e" | "#0ea5e9";

const brushColors: BrushColor[] = ["#111827", "#0ea5e9", "#8b5cf6", "#ec4899", "#22c55e", "#f59e0b"];

export default function DesignStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hasDrawingRef = useRef(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [brushColor, setBrushColor] = useState<BrushColor>("#8b5cf6");
  const [brushSize, setBrushSize] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasDrawing, setHasDrawing] = useState(false);

  const canSubmit = useMemo(() => title.trim().length > 0 && hasDrawing && !submitting, [
    title,
    hasDrawing,
    submitting,
  ]);

  const paintBackground = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "#f8f4ff";
    ctx.fillRect(0, 0, width, height);
  }, []);

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    paintBackground(context, rect.width, rect.height);
  }, [paintBackground]);

  useEffect(() => {
    syncCanvasSize();

    const handleResize = () => {
      syncCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [syncCanvasSize]);

  const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const drawLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(event);
    if (!point) {
      return;
    }

    drawingRef.current = true;
    lastPointRef.current = point;
    hasDrawingRef.current = true;
    setHasDrawing(true);

    const canvas = canvasRef.current;
    canvas?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) {
      return;
    }

    const currentPoint = getCanvasPoint(event);
    const previousPoint = lastPointRef.current;

    if (!currentPoint || !previousPoint) {
      return;
    }

    drawLine(previousPoint, currentPoint);
    lastPointRef.current = currentPoint;
  };

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    lastPointRef.current = null;
    const canvas = canvasRef.current;
    canvas?.releasePointerCapture(event.pointerId);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    paintBackground(context, rect.width, rect.height);
    hasDrawingRef.current = false;
    setHasDrawing(false);
    setError(null);
    setSuccessMessage(null);
  };

  const exportDesign = () => {
    const canvas = canvasRef.current;

    if (!canvas || !hasDrawingRef.current) {
      return null;
    }

    return canvas.toDataURL("image/png");
  };

  const handleSubmit = async () => {
    const designDataUrl = exportDesign();

    if (!designDataUrl) {
      setError("Draw something on the canvas before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      await submitDesignRequest({
        title,
        notes,
        designDataUrl,
      });

      setSuccessMessage("Your design request was sent to the admin review queue.");
      setTitle("");
      setNotes("");
      clearCanvas();
    } catch (requestError) {
      const message = requestError instanceof Error
        ? requestError.message
        : "Failed to submit your design request.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="design-studio page-fade-in">
      <section className="design-studio-hero">
        <div>
          <p className="design-studio-eyebrow">Custom request</p>
          <h1>Sketch the idea you want the admin to see.</h1>
          <p>
            Draw directly in the browser, add a title and note, then send it to the private admin review queue.
          </p>
        </div>

        <div className="design-studio-hero-card">
          <span>Private workflow</span>
          <strong>Visible only to you and admins</strong>
          <p>Use this for custom furniture ideas, color variations, or any made-to-order concept.</p>
        </div>
      </section>

      {error ? <p className="design-studio-message design-studio-error">{error}</p> : null}
      {successMessage ? <p className="design-studio-message design-studio-success">{successMessage}</p> : null}

      <section className="design-studio-layout">
        <div className="design-studio-canvas-panel">
          <div className="design-studio-toolbar">
            <div className="design-studio-tool-group">
              <label htmlFor="design-title">Title</label>
              <input
                id="design-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Modern sofa with curved arms"
              />
            </div>

            <div className="design-studio-tool-group">
              <label htmlFor="design-notes">Notes</label>
              <input
                id="design-notes"
                type="text"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Preferred fabric, dimensions, or details"
              />
            </div>
          </div>

          <div className="design-studio-controls">
            <div className="design-studio-color-palette" aria-label="Brush colors">
              {brushColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`design-studio-color-swatch ${brushColor === color ? "is-active" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setBrushColor(color)}
                  aria-label={`Use brush color ${color}`}
                />
              ))}
            </div>

            <label className="design-studio-size-control">
              Brush size
              <input
                type="range"
                min="4"
                max="28"
                value={brushSize}
                onChange={(event) => setBrushSize(Number(event.target.value))}
              />
            </label>

            <button type="button" className="design-studio-secondary" onClick={clearCanvas}>
              Clear canvas
            </button>
          </div>

          <div className="design-studio-canvas-shell">
            <canvas
              ref={canvasRef}
              className="design-studio-canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
            />
          </div>

          <div className="design-studio-footer">
            <p>
              Tip: keep the sketch loose. Admins can review the idea and reply with a custom offer or clarification.
            </p>
            <button type="button" className="design-studio-submit" onClick={handleSubmit} disabled={!canSubmit}>
              {submitting ? "Sending..." : "Send to admin"}
            </button>
          </div>
        </div>

        <aside className="design-studio-sidecard">
          <h2>How it works</h2>
          <ol>
            <li>Draw directly on the canvas.</li>
            <li>Add a short title and optional notes.</li>
            <li>Submit the request to the admin-only queue.</li>
          </ol>
          <p>
            The drawing is stored as an image snapshot, so admins can see exactly what you made without extra
            downloads.
          </p>
        </aside>
      </section>
    </main>
  );
}
