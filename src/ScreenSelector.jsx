import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Main from './components/Main';
import Login from './components/Login';
import { DndProvider } from 'react-dnd'

import { Provider } from 'react-redux';
import store from './redux/store';
import HTML5Backend from 'react-dnd-html5-backend'
import './App.scss';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux'

export class ScreenSelector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.userData) {
      return (
        <DndProvider backend={HTML5Backend}>
          <Main/>
        </DndProvider>
      )
    } else {
      return (
        <Login/>
      )
    }
  }

}

const mapStateToProps = state => {
  return {
    userData: state.user.userData
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}


export default connect(mapStateToProps, mapDispatchToProps)(ScreenSelector);

