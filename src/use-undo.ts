import { MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { detectRedo, detectUndo, forceClone } from './helper';

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

    const hist = useRef<{ undos: any[]; redos: any[] }>({
        undos: [],
        redos: [],
    });

    const [undoable, setUndoable] = useState<boolean>(hist.current.undos.length > 1);
    const [redoable, setRedoable] = useState<boolean>(hist.current.redos.length > 0);

    const setUndoableRedoable = () => {
        setUndoable(hist.current.undos.length > 1);
        setRedoable(hist.current.redos.length > 0);
    }

    

    const undo = (): void => {
        if (hist.current.undos.length <= 1) return;
        const { undos, redos } = hist.current;
        redos.push(undos.pop());
        setValue(undos[undos.length - 1]);
        setUndoableRedoable();
    };

    const redo = (): void => {
        if (hist.current.redos.length === 0) return;
        const { undos, redos } = hist.current;
        undos.push(redos.pop());
        setValue(undos[undos.length - 1]);
        setUndoableRedoable();
    };

    useEffect(() => {
        const { undos } = hist.current;
        if (undos[undos.length - 1] === value) return;

        undos.push(forceClone(value));
        hist.current.redos = [];
        setUndoableRedoable();
    }, [value]);

    const keyPressEvent = useCallback((e: KeyboardEvent): any => {
        const { undos, redos } = hist.current;
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
        ...hist.current,
        redo,
        undo,
        element,
    };
};

export default useUndo;
