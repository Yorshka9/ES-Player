export const increment = (n) => {
    return {
        type: 'INCREMENT',
        payload: n
    }
}

export const decrement = (n) => {
    return {
        type: 'DECREMENT',
        payload: n
    }
}

export const log_in = () => {
    return {
        type: 'LOG_IN'
    }
}