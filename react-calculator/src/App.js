import './styles.scss';

import { useReducer, useEffect } from 'react';

import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import MemoryButton from './MemoryButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
  CHOOSE_MEMORY: 'choose-memory',
  GET_LOCAL_STORAGE : 'get-local-storage-memory',
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {...state, 
          currentOperand: payload.digit,
          overwrite: false,        
       }
      }
      if(payload.digit === '0' && state.currentOperand === '0') return state
      if(payload.digit === '.' && state.currentOperand.includes('.')) return state
      return {...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null) return state
      if(state.previousOperand == null) {
        return {...state,
        currentOperand: null,
        previousOperand: state.currentOperand,
        operation: payload.operation
      }}
      if(state.currentOperand == null) {
        return {...state,
         operation: payload.operation,

        }
      }      

      return {...state, 
      previousOperand: evaluate(state),
      operation: payload.operation,
      currentOperand: null
    }
    case ACTIONS.CLEAR:
      return {...state,
        currentOperand: null,
        previousOperand: null,
        operation: null
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) {
        return {...state, 
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null) return state
      return {...state,
      currentOperand: `${state.currentOperand.toString().slice(0, -1)}` }
    case ACTIONS.EVALUATE:
      if(state.previousOperand == null ) return state
      return {...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
    case ACTIONS.CHOOSE_MEMORY:
      switch(payload.memoryOperation) {
        case 'M+' :
          if(state.previousOperand && !state.currentOperand) {
            return {...state, 
              memory: parseFloat(state.previousOperand) + parseFloat(state.memory)
            }
          }
          if(state.previousOperand && state.currentOperand) {
            return {...state,
              memory: evaluate({currentOperand: state.currentOperand, previousOperand: state.previousOperand, operation: state.operation}) + parseFloat(state.memory)
            }
          }
          return {...state, 
            memory: parseFloat(state.currentOperand) + parseFloat(state.memory)
          }
        
        case 'M-':

          if(state.previousOperand && !state.currentOperand) {
            return {...state, 
              memory: parseFloat(state.previousOperand) + parseFloat(state.memory)
            }
          }
          if(state.previousOperand && state.currentOperand) {
            return {...state,
              memory: evaluate({currentOperand: state.currentOperand, previousOperand: state.previousOperand, operation: state.operation}) - parseFloat(state.memory)
            }
          }
          return {...state, 
            memory: parseFloat(state.currentOperand) + parseFloat(state.memory)
          }

        case 'MR' : 
          console.log("state.memory mr", state.memory)
          console.log("state mr", state)
          return {...state,
            currentOperand: state.currentOperand == null ?  state.memory : 0,
          }
        case 'MC' :
          return {...state,
            memory: 0
          }
        default :
          return state;
      }
    case ACTIONS.GET_LOCAL_STORAGE:
      return {...state, memory: payload.memoryValue}
    default: 
      return state
  }

}

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  switch(operation) {
    case '+' :
      return prev + current;
    case '-' :
      return prev - current;
    case '*' : 
      return prev * current;
    case '/':
      return prev / current;
    default: 
      return;
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0, 
})

function formatOperand(operand) {
  if(operand == null) return
  const [integer, decimal] = operand.toString().split(".")
  if(decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

  const [{ currentOperand, previousOperand, operation, memory }, dispatch] = useReducer(reducer, {memory: 0});

  useEffect(() => {
    const memoryValue = window.localStorage.getItem('MEMORY_VALUE');
    if(memoryValue) dispatch({type: ACTIONS.GET_LOCAL_STORAGE, payload: {memoryValue: memoryValue}});
  }, [])

  useEffect(() => {
    if(memory > 0) window.localStorage.setItem('MEMORY_VALUE', memory);
  }, [memory])

  return (
    <div className='calculator-grid' >
      <div className='output'>
        <div className='memory'>{memory ? 'M' : ''}</div>
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{ formatOperand(currentOperand)}</div>
      </div>
      <MemoryButton memoryOperation="MC" dispatch={dispatch}/>
      <MemoryButton memoryOperation="M+" dispatch={dispatch}/>
      <MemoryButton memoryOperation="M-" dispatch={dispatch}/>
      <MemoryButton memoryOperation="MR" dispatch={dispatch}/>

      <button onClick={
        () => {
          dispatch({type: ACTIONS.CLEAR})
        }
      } className='span-two'>AC</button>
      <button onClick={ ()=> {
        dispatch({type: ACTIONS.DELETE_DIGIT})
      }} >DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className='span-two' onClick={() => {
        dispatch({type: ACTIONS.EVALUATE})
      }}>=</button>

    </div>

  )
}

export default App;
