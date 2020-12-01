import { MutableRefObject, SetStateAction, useCallback, useEffect, useRef } from 'react';
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
    values: any;
    setValues: SetStateAction<any>;
}

const useUndo = (params: UseUndoParams): UndoInterface => {
    const { values, setValues } = params;

    const element = useRef<HTMLElement>(null);

    const hist = useRef<{ undos: any[]; redos: any[] }>({
        undos: [],
        redos: [],
    });

    const undoable = hist.current.undos.length > 0;
    const redoable = hist.current.redos.length > 0;

    const undo = (): void => {
        if (undoable) return;
        const { undos, redos } = hist.current;

        redos.push(undos.pop());

        setValues(undos[undos.length - 1]);
    };

    const redo = (): void => {
        if (redoable) return;

        const { undos, redos } = hist.current;

        undos.push(redos.pop());

        setValues(undos[undos.length - 1]);
    };

    useEffect(() => {
        const { undos } = hist.current;
        if (undos[undos.length - 1] === values) return;

        undos.push(forceClone(values));
        hist.current.redos = [];
    }, [values]);

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
    }, []);

    useEffect(() => {
        return () => {
            const el = element.current || document;
            el.removeEventListener('keydown', keyPressEvent);
        };
    });

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
