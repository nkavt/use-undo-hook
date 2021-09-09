import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { detectRedo, detectUndo } from "./helper";
import useUndoStack from "./use-undo-stack";

interface UndoInterface<T> {
  undoable: boolean;
  redoable: boolean;

  undos: T[];
  redos: T[];

  redo: () => void;
  undo: () => void;
  element: MutableRefObject<HTMLElement | null>;
}

interface UseUndoParams<T> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
}

const useUndo = <T = any>(params: UseUndoParams<T>): UndoInterface<T> => {
  const { value, setValue } = params;

  const element = useRef<HTMLElement>(null);

  const undoStack = useUndoStack();

  const [undoable, setUndoable] = useState<boolean>(false);
  const [redoable, setRedoable] = useState<boolean>(false);

  const [undos, setUndos] = useState<T[]>([]);
  const [redos, setRedos] = useState<T[]>([]);

  const setUndoableRedoable = () => {
    setUndoable(undoStack.current!.canUndo());
    setRedoable(undoStack.current!.canRedo());
    setUndos(undoStack.current!.undos);
    setRedos(undoStack.current!.redos);
  };

  const undo = (): void => {
    if (!undoStack.current!.undo()) return;

    setValue(() => undoStack.current!.lastUndo());
    setUndoableRedoable();
  };

  const redo = (): void => {
    if (!undoStack.current!.redo()) return;
    setValue(undoStack.current!.lastUndo());
    setUndoableRedoable();
  };

  useEffect(() => {
    if (undoStack.current!.lastUndo() === value) return;

    undoStack.current!.change(value);
    setUndoableRedoable();
  }, [value]);

  const keyPressEvent = useCallback((e: KeyboardEvent) => {
    if (detectRedo(e)) {
      e.preventDefault();
      return redo();
    }

    if (detectUndo(e)) {
      e.preventDefault();
      return undo();
    }
  }, []) as EventListener;

  useEffect(() => {
    const el = element.current || document;

    el.addEventListener("keydown", keyPressEvent);

    return () => {
      el.removeEventListener("keydown", keyPressEvent);
    };
  }, [keyPressEvent]);

  return {
    undoable,
    redoable,
    undos,
    redos,
    redo,
    undo,
    element,
  };
};

export default useUndo;
