import React, { useReducer, useState } from 'react'

function Home() {
  const [state, setState] = useState(1)
  const func = () => {
    console.log(state)
    setState(state + 1)
    console.log(state)
  }
  return (
    <div className="Home" onClick={func}>
      {state}
    </div>
  )
}

const initialState = { count: 0 };

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <div style={{ width: '100px', height: '100px' }}>
        <span>
          1
        </span>
      </div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}

export default Counter
