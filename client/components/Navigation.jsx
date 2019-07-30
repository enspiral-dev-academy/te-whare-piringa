import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Waiting from './Waiting'

class Navigation extends React.Component {
  constructor () {
    super()
    this.state = {
      menuIsHidden: true
    }
    this.showMenu = this.showMenu.bind(this)
  }

  showMenu () {
    this.setState({
      menuIsHidden: !this.state.menuIsHidden
    })
    // var x = this.refs.navigationList
    // if (x.className === 'navigation-list') {
    //   x.className += ' responsive-menu'
    // } else {
    //   x.className = 'navigation-list'
    // }
  }

  render () {
    const { menuIsHidden } = this.state
    const { fullName, admin } = this.props.user
    return (
      <header className="navigation">
        <nav className="">
          <div className="navigation-div">
            <h2 className="navigation-home">
              <Link className="navigation-home-link" to="/">Te Whare Piringa</Link>
              {this.props.waiting && <Waiting /> }
            </h2>
            <span aria-hidden="true" onClick={this.showMenu}
              className="glyphicon glyphicon glyphicon-menu-hamburger menu-button">
            </span>
            <ul className={`navigation-list${menuIsHidden && ' responsive-menu'}`}>
              <Link className="navigation-list-link" to="/calendar">
                <li className="navigation-list-item">Book</li>
              </Link>
              <a className="navigation-list-link" href="#hall">
                <li className="navigation-list-item">Hall</li>
              </a>
              <a className="navigation-list-link" href="#gallery">
                <li className="navigation-list-item">Gallery</li>
              </a>
              <a className="navigation-list-link" href="#about">
                <li className="navigation-list-item">About</li>
              </a>
              <a className="navigation-list-link" href="#contact">
                <li className="navigation-list-item">Contact</li>
              </a>
              {fullName && !admin && <Link
                className="navigation-list-link" to="/profile">
                <li className="navigation-list-item">Profile</li>
              </Link>}
              {admin && <Link to="/admin"
                className="navigation-list-link">
                <li className="navigation-list-item">Admin</li>
              </Link>}
              {!fullName && <Link to="/register"
                className="navigation-list-link">
                <li className="navigation-list-item">Register</li>
              </Link>}
              {!fullName && <Link to="/login"
                className="navigation-list-link">
                <li className="navigation-list-item">Log In</li>
              </Link>}
              {fullName && <a
                className="navigation-list-link"
                style={{ cursor: 'pointer' }}>logout
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
    user: state.user,
    waiting: state.waiting
  }
}

export default connect(mapStateToProps)(Navigation)
