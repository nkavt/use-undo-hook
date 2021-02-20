import { MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { detectRedo, detectUndo, forceClone } from './helper';
import Undo from './undo';
import useUndoStack from './use-undo-stack';

interface UndoInterface {
    undoable: boolean;
    redoable: boolean;

    undos: any[];
    redos: any[];

    redo: () => void;
    undo: () => void;
    element: MutableRefObject<HTMLElement | null>;
}

interface UseUndoParams {
    value: any;
    setValue: SetStateAction<any>;
}


const useUndo = (params: UseUndoParams): UndoInterface => {
    const { value, setValue } = params;

    const element = useRef<HTMLElement>(null);

    const undoStack = useUndoStack(value);

    const [undoable, setUndoable] = useState<boolean>(false);
    const [redoable, setRedoable] = useState<boolean>(false);

    const [undos, setUndos] = useState<any[]>([value]);
    const [redos, setRedos] = useState<any[]>([]);

    const setUndoableRedoable = () => {
        setUndoable(undoStack.current!.canUndo());
        setRedoable(undoStack.current!.canRedo());
        setUndos(undoStack.current!.undos);
        setRedos(undoStack.current!.redos);
    }

    

    const undo = (): void => {
        if (!undoStack.current!.undo()) return;

        setValue(undoStack.current!.lastUndo());
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

    const keyPressEvent = useCallback((e: KeyboardEvent): any => {
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

        el.addEventListener('keydown', keyPressEvent);

        return () => {
            el.removeEventListener('keydown', keyPressEvent);
        };
    }, []);

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
