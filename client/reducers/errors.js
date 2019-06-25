import { VALIDATION_ERROR, CLEAR_ERROR } from '../actions'

const initialState = {
  validationError: false,
  message: ''
}

const errors = (state = initialState, action) => {
  switch (action.type) {
    case VALIDATION_ERROR:
      return {
        validationError: true,
        message: action.message
      }
    case CLEAR_ERROR:
      return {
        validationError: false
      }
    default:
      return state
  }
}

export default errors
