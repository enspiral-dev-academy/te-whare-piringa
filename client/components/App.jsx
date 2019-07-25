import React from 'react'
import { connect } from 'react-redux'
import { Route, Router } from 'react-router-dom'

import Home from './Home'
import Book from './Book'
import Error from './Error'
import history from '../utils/history'
import AdminPortal from './AdminPortal'
import Registration from './Registration'
import DetailsProfile from './DetailsProfile'
import NewCalendar from './NewCalendar'
import Navigation from './Navigation'
import Schedular from './Schedular'
import Details from './Details'

import { checkLogin } from '../actions/auth'

class App extends React.Component {
  render () {
    return (
      <Router history={history} component={App}>
        <div>
          <Route path='/' render={props => (
            <Navigation fullName={this.props.user.fullName} />
          )}/>
          {this.props.error && <Error /> }
          {this.props.errors.validationError && <Error />}
          <Route exact path='/' component={Home} />
          <Route path='/admin' component={AdminPortal} />
          <Route path='/calendar' component={NewCalendar} />
          <Route path='/schedule' component={Schedular} />
          <Route path="/book" component={Book} />
          <Route path='/register' component={Registration} />
          <Route path='/profile' component={AdminPortal} />
          <Route path='/details' component={Details} />
          <Route path='/detailsprofile' component={DetailsProfile} />
        </div>
      </Router>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user,
    error: state.error,
    errors: state.errors
  }
}

function mapDispatchToProps (dispatch) {
  return {
    checkLogin: () => dispatch(checkLogin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
