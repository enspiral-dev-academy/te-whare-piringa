import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isAuthenticated } from 'authenticare/client'

import Waiting from './Waiting'
import { signOff } from '../actions/auth'

class Navigation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menuIsHidden: true
    }
    this.showMenu = this.showMenu.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  showMenu () {
    this.setState({
      menuIsHidden: !this.state.menuIsHidden
    })
  }

  logOut () {
    this.props.dispatch(signOff())
    this.props.history.push('/')
  }

  render () {
    const { menuIsHidden } = this.state
    const { isWaiting, isAdmin } = this.props
    return (
      <header className="navigation">
        <nav className="">
          <div className="navigation-div">
            <h2 className="navigation-home">
              <Link className="navigation-home-link" to="/">Te Whare Piringa</Link>
              {isWaiting && <Waiting /> }
            </h2>
            <span aria-hidden="true" onClick={this.showMenu}
              className="glyphicon glyphicon glyphicon-menu-hamburger menu-button">
            </span>
            <ul className={`navigation-list${menuIsHidden && ' responsive-menu'}`}>
              <Link className="navigation-list-link" to="/calendar">
                <li className="navigation-list-item">Book</li>
              </Link>
              <a className="navigation-list-link" href="/#hall">
                <li className="navigation-list-item">Hall</li>
              </a>
              <a className="navigation-list-link" href="/#gallery">
                <li className="navigation-list-item">Gallery</li>
              </a>
              <a className="navigation-list-link" href="/#about">
                <li className="navigation-list-item">About</li>
              </a>
              <a className="navigation-list-link" href="/#contact">
                <li className="navigation-list-item">Contact</li>
              </a>
              {isAuthenticated() && !isAdmin && <Link
                className="navigation-list-link" to="/profile">
                <li className="navigation-list-item">Profile</li>
              </Link>}
              {isAuthenticated() && isAdmin && <Link to="/admin"
                className="navigation-list-link">
                <li className="navigation-list-item">Admin</li>
              </Link>}
              {!isAuthenticated() && <Link to="/register"
                className="navigation-list-link">
                <li className="navigation-list-item">Register</li>
              </Link>}
              {!isAuthenticated() && <Link to="/login"
                className="navigation-list-link">
                <li className="navigation-list-item">Log In</li>
              </Link>}
              {isAuthenticated() && <a
                className="navigation-list-link"
                style={{ cursor: 'pointer' }}>
                <li className="navigation-list-item"
                  onClick={this.logOut}>Logout</li>
              </a>}
            </ul>
          </div>
        </nav>
      </header>
    )
  }
}

function mapStateToProps (state) {
  return {
    isWaiting: state.waiting,
    isAdmin: state.user.details && state.user.details.isAdmin
  }
}

export default connect(mapStateToProps)(Navigation)
