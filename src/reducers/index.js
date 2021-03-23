
import {combineReducers} from 'redux'


    const loggedReducer = (state = false, action) => {
        switch(action.type){
            case 'LOG_IN':
                return !state
                default: 
                    return state
            }   
        }
    
    const counterReducer = (state = 0, action) => {
        switch(action.type){
            case "INCREMENT":
                return state + action.payload
                case "DECREMENT": 
                return state - action.payload
                default:
                    return state;
                }
            }
    
    const playingReducer = (state = false, action) => {
        switch(action.type) {
            case 'SET_ISPLAYING':
                return !state
                default:
                    return state
        }
    }
            
    const allReducers = combineReducers({
        counter: counterReducer,
        isLogged: loggedReducer
            })

export default allReducers