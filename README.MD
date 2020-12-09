# Installation

## Yarn
```sh
yarn add @nkavtaradze/use-undo-hook
```

## NPM

```sh
npm install @nkavtaradze/use-undo-hook --save
```

# Usage

```js
import useUndo from'@nkavtaradze/use-undo-hook';
import { useState } from 'react';
function App() {

    const [count, setCount] = useState(0);
    const {
        element, 
        undo,
        redo,
        undos,
        redos,
        undoable,
        redoable,
    } = useUndo({
        value: count,
        setValue: setCount,
    })

    return (
        <div
            style={{
                textAlign: 'center',
            }}
        >
            <div>{count}</div>
            <div>
                <button
                    disabled={!undoable}
                    onClick={undo}
                >Undo</button>
                <button 
                    onClick={() => setCount(count + 1)
                }>Add</button>
                <button
                    disabled={!redoable}
                    onClick={redo}
                >Redo</button>
            </div>
        </div>
    );
}

export default App;

```

<p>
    It will automatically bind ctr + z and ctr + y (cmd + z, cmd + shift + z for macos ) shorcuts to document element.
</p>


<p>
    If you want to bind it on different DOM element you mast pass <b>element</b> variable to <b>ref</b> attribute like this:
</p>

```js
import useUndo from'@nkavtaradze/use-undo-hook';
import { useState } from 'react';


function App() {

    const [count, setCount] = useState(0);
    const {
        element, 
        undo,
        redo,
        undos,
        redos,
        undoable,
        redoable,
    } = useUndo({
        value: count,
        setValue: setCount,
    })

    return (
        <div
            style={{
                textAlign: 'center',
            }}
        >
            <div ref={element} tabIndex="0">
                Bind listeners here
            </div>
            <div>{count}</div>
            <div>
                <button
                    disabled={!undoable}
                    onClick={undo}
                >Undo</button>
                <button 
                    onClick={() => setCount(count + 1)}
                >Add</button>
                <button
                    disabled={!redoable}
                    onClick={redo}
                >Redo</button>
            </div>
        </div>
    );
}

export default App;

```