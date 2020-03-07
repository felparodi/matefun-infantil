import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Main from './components/Main';
import Login from './components/Login';
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import './App.scss';

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
    if (this.state.isLoggedIn) {
      return (
        <DndProvider backend={HTML5Backend}>
          <Main userData={this.state.userData} onLogout={this.onLogout}></Main>
        </DndProvider>
      )
    } else {
      return (
        <Login onLogin={this.onLogin}></Login>
      )
    }

  }

}
