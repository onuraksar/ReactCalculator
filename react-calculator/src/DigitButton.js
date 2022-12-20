import React from 'react'

import {ACTIONS} from './App';

export default function DigitButton({digit, dispatch, className}) {
    
  return (
    <button className={className} onClick={() => {
        dispatch({type: ACTIONS.ADD_DIGIT, payload: {digit: digit}})
    }} >{digit}</button>
  )
}
