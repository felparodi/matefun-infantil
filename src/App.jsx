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
import ScreenSelector from './ScreenSelector';

export default class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Provider store={store}>
        <ScreenSelector/>
      </Provider>
    )
  }

}
