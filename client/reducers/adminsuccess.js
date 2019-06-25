import { ADMINSUCCESS } from '../actions/index'
const initialState = false

const adminSuccess = (state = initialState, action) => {
  switch (action.type) {
    case ADMINSUCCESS:
      return true
    default:
      return state
  }
}

export default adminSuccess
