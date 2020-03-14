import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Main from './components/Main';
import Login from './components/Login';
import { DndProvider } from 'react-dnd'

import { Provider } from 'react-redux';
import store from './redux';
import HTML5Backend from 'react-dnd-html5-backend'
import './App.scss';
import { Container } from 'react-bootstrap';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userData: {},
      isLoggedIn: false
    };

    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  onLogin(userData) {
    this.setState({
      userData: userData,
      isLoggedIn: true
    })
  }

  onLogout() {
    this.setState({
      userData: {},
      isLoggedIn: false
    })
  }

  render() {
    let contain = null;
    if (this.state.isLoggedIn) {
      contain = (
        <DndProvider backend={HTML5Backend}>
          <Main userData={this.state.userData} onLogout={this.onLogout}></Main>
        </DndProvider>
      )
    } else {
      contain = (
        <Login onLogin={this.onLogin}></Login>
      )
    }
    return (
      <Provider store={store}>
        {contain}
      </Provider>
    )
  }

}
