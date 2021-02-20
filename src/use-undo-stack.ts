import { useEffect, useRef } from 'react';
import Undo from './undo';

const useUndoStack = (value: any) => {
    const undoStack = useRef<Undo | null>(null);

    useEffect(() => {
        undoStack.current = new Undo(value);
    },[]);

    return undoStack;
}

export default useUndoStack;