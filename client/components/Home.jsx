import React from 'react'
import { Link } from 'react-router-dom'

import Hall from './Hall'
import Gallery from './Gallery'
import About from './About'
import Contact from './Contact'
import Credits from './Credits'

class Home extends React.Component {
  render () {
    return (
      <div className="home-background">
        <div className="main-background">
          <div className="home-button-box">
            <h1>Te Whare Piringa</h1>
            <h2>Our Place</h2>
            <p>&quot;Tamaki, the most thriving, engaged, and dynamic community&quot;</p>
            <Link to="/calendar" className="home-book-link"><div className="home-book-button">Book Now</div></Link>
          </div>
        </div>
        <div className="home-content-div">
          <div className="home-route-content">
            <Hall />
            <Gallery />
            <About />
            <Contact />
            <Credits />
          </div>
        </div>
      </div>
    )
  }
}

export default Home
