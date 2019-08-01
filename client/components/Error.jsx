import React from 'react'
import Modal from 'react-modal'
import { connect } from 'react-redux'

import { clearError } from '../actions/errors'

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

class Error extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: !!props.error
    }
  }

  handleClose () {
    this.props.dispatch(clearError())
    this.setState({
      modalVisible: false
    })
  }

  render () {
    return (
      <Modal
        style={modalStyle}
        isOpen={this.state.modalVisible}
        onRequestClose={this.handleClose}>
        <div>
          <h1>{this.props.error}</h1>
        </div>
      </Modal>
    )
  }
}

function mapStateToProps ({ error }) {
  return { error }
}

export default connect(mapStateToProps)(Error)
