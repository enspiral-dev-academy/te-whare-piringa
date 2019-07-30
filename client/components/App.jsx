import React from 'react'
import { connect } from 'react-redux'
import { Route, Router } from 'react-router-dom'

import Home from './Home'
import Book from './Book'
import Error from './Error'
import Login from './Login'
import history from '../utils/history'
import AdminPortal from './AdminPortal'
import Registration from './Registration'
import DetailsProfile from './DetailsProfile'
import Calendar from './Calendar'
import Navigation from './Navigation'
import Schedular from './Schedular'
import Details from './Details'

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
          <Route path='/login' component={Login} />
          <Route path='/admin' component={AdminPortal} />
          <Route path='/calendar' component={Calendar} />
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

export default connect(mapStateToProps)(App)
