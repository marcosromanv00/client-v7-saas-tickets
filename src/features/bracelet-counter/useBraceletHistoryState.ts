import { useState, useCallback } from "react";

export function useBraceletHistoryState(
  deliveredCount: number,
  lastDeliveryDelta: number = 1,
  onAddDelta: (delta: number, note?: string) => void
) {
  const [undoStack, setUndoStack] = useState<number[]>([]);
  const [redoStack, setRedoStack] = useState<number[]>([]);

  const registerAction = useCallback((delta: number) => {
    setUndoStack((prev) => [...prev, delta]);
    setRedoStack([]);
  }, []);

  const undo = useCallback(() => {
    let deltaToRevert = undoStack[undoStack.length - 1];
    if (deltaToRevert === undefined) {
      deltaToRevert = lastDeliveryDelta;
    }
    if (!deltaToRevert || deliveredCount <= 0) return;

    const revertAmount = -deltaToRevert;
    onAddDelta(revertAmount, `Deshacer (${revertAmount > 0 ? `+${revertAmount}` : revertAmount})`);

    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, deltaToRevert]);
  }, [undoStack, lastDeliveryDelta, deliveredCount, onAddDelta]);

  const redo = useCallback(() => {
    const deltaToReapply = redoStack[redoStack.length - 1];
    if (deltaToReapply === undefined) return;

    onAddDelta(deltaToReapply, `Rehacer (${deltaToReapply > 0 ? `+${deltaToReapply}` : deltaToReapply})`);

    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, deltaToReapply]);
  }, [redoStack, onAddDelta]);

  const clearHistory = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  const canUndo = deliveredCount > 0 && (undoStack.length > 0 || lastDeliveryDelta > 0);
  const canRedo = redoStack.length > 0;
  const lastUndoVal = undoStack.length > 0 ? undoStack[undoStack.length - 1] : lastDeliveryDelta;
  const lastRedoVal = redoStack.length > 0 ? redoStack[redoStack.length - 1] : undefined;

  return {
    registerAction,
    undo,
    redo,
    clearHistory,
    canUndo,
    canRedo,
    lastUndoVal,
    lastRedoVal,
  };
}
