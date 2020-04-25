
import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import ScreenSelector from './ScreenSelector';
import ToastMessages from './components/ToastMessages';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';


export default class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Provider store={store}>
        <ScreenSelector/>
        <ToastMessages/>
      </Provider>
    )
  }

}
