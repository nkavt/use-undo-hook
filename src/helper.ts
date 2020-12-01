export const forceClone = (obj: any) => JSON.parse(JSON.stringify(obj));

export const isMac = (): boolean => navigator.platform.slice(0, 3).toUpperCase() === 'MAC';


export const detectUndo = (e: KeyboardEvent):boolean => {
    const isZ = e.code === 'KeyZ';
    if(isMac()) {
        return e.metaKey && isZ;
    } 

    return e.ctrlKey && isZ;
}

export const detectRedo = (e: KeyboardEvent):boolean => {
    if(isMac()) {
        return e.metaKey && e.shiftKey && e.code === 'KeyZ';
    } 

    return e.ctrlKey && e.code === 'KeyY';
}