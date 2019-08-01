export const SHOW_ERROR = 'ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'
export const VALIDATION_ERROR = 'VALIDATION_ERROR'

export function showError (error) {
  return {
    type: SHOW_ERROR,
    error: error.message
  }
}

export function clearError () {
  return {
    type: CLEAR_ERROR
  }
}

export function validationError (message) {
  return {
    type: VALIDATION_ERROR,
    message
  }
}
