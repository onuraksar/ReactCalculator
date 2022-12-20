import React from 'react'

import {ACTIONS} from './App';

export default function OperationButton({operation, dispatch, className}) {
  return (
    <button className={className} onClick={
      () => {
        dispatch({type: ACTIONS.CHOOSE_OPERATION, payload: {operation: operation}})
      }
    } >{operation}</button>
  )
}
