import { useEffect, useRef } from 'react';
import Undo from './undo';

const useUndoStack = () => {
    const undoStack = useRef<Undo | null>(null);

    useEffect(() => {
        undoStack.current = new Undo();
    },[]);

    return undoStack;
}

export default useUndoStack;