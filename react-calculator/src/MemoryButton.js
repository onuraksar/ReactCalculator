import React from 'react'

import {ACTIONS} from './App';

export default function MemoryButton({memoryOperation,dispatch }) {
  return (
    <button onClick={
      () => {
        dispatch({type: ACTIONS.CHOOSE_MEMORY, payload: {memoryOperation: memoryOperation} })
      }
    }>{memoryOperation}</button>
  )
}
