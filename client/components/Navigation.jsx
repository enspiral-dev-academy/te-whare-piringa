import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Login from './Login'
import Waiting from './Waiting'

// let responsiveMenu = null

class Navigation extends React.Component {
  constructor () {
    super()
    this.showMenu = this.showMenu.bind(this)
  }

  showMenu () {
    var x = this.refs.navigationList
    if (x.className === 'navigation-list') {
      x.className += ' responsive-menu'
    } else {
      x.className = 'navigation-list'
    }
  }

  render () {
    return (
      <header className="navigation">
        <nav className="">
          <div className="navigation-div">
            <h2 className="navigation-home">
              <Link className="navigation-home-link" to="/">Te Whare Piringa</Link>{this.props.waiting && <Waiting /> }
            </h2>
            <span className="glyphicon glyphicon glyphicon-menu-hamburger menu-button" aria-hidden="true" onClick={this.showMenu}></span>
            <ul className="navigation-list" ref="navigationList" onClick={this.showMenu}>
              <Link className="navigation-list-link" to="/calendar"><li className="navigation-list-item">Book</li></Link>
              <a className="navigation-list-link" href="#hall"><li className="navigation-list-item">Hall</li></a>
              <a className="navigation-list-link" href="#gallery"><li className="navigation-list-item">Gallery</li></a>
              <a className="navigation-list-link" href="#about"><li className="navigation-list-item">About</li></a>
              <a className="navigation-list-link" href="#contact"><li className="navigation-list-item">Contact</li></a>
              {this.props.user.fullName && !this.props.user.admin && <Link className="navigation-list-link" to="/profile"><li className="navigation-list-item">Profile</li></Link>}
              {this.props.user.admin && <Link className="navigation-list-link" to="/admin"><li className="navigation-list-item">Admin</li></Link>}
              {!this.props.user.fullName && <a className="navigation-list-link" style={{ cursor: 'pointer' }}><Login /></a>}
              {this.props.user.fullName && <a className="navigation-list-link" style={{ cursor: 'pointer' }}>logout</a>}
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
