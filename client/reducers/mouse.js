const initialState = { clicked: false }

const mouse = (state = initialState, action) => {
  switch (action.type) {
    case 'CLICKED':
      return { clicked: !state.clicked }
    default:
      return state
  }
}

export default mouse
