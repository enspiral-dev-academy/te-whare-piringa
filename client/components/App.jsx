import React from 'react'
import { connect } from 'react-redux'
import { Route, BrowserRouter as Router } from 'react-router-dom'

import AdminPortal from './AdminPortal'
import Book from './Book'
import Calendar from './Calendar'
import Details from './Details'
import DetailsProfile from './DetailsProfile'
import Error from './Error'
import Home from './Home'
import Login from './Login'
import history from '../utils/history'
import Registration from './Registration'
import Navigation from './Navigation'
import Schedular from './Schedular'
import Profile from './Profile'

import { getUserProfile } from '../actions/auth'
import { getBookings } from '../actions/bookings'

class App extends React.Component {
  componentDidMount () {
    this.props.dispatch(getBookings())
    this.props.dispatch(getUserProfile())
  }

  render () {
    return (
      <Router history={history} component={App}>
        <div>
          <Route path='/' component={Navigation} />
          {this.props.error && <Error /> }
          <Route exact path='/' component={Home} />
          <Route path='/login' component={Login} />
          <Route path='/admin' component={AdminPortal} />
          <Route path='/calendar' component={Calendar} />
          <Route path='/schedule' component={Schedular} />
          <Route path="/book" component={Book} />
          <Route path='/register' component={Registration} />
          <Route path='/profile' component={Profile} />
          <Route path='/details' component={Details} />
          <Route path='/detailsprofile' component={DetailsProfile} />
        </div>
      </Router>
    )
  }
}

function mapStateToProps ({ error }) {
  return { error }
}

export default connect(mapStateToProps)(App)
