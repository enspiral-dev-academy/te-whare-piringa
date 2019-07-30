const emptyUser = {
  email: null,
  fullName: null,
  phoneNumber: null
}

export default function (user = emptyUser, action) {
  switch (action.type) {
    case 'LOGGED_IN':
      return action.user
    case 'LOGGED_OUT':
      return emptyUser
    default:
      return user
  }
}
