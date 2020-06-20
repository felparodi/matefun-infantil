
import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider, Trans } from 'react-i18next';
import i18n from './i18next';
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
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <ScreenSelector/>
          <ToastMessages/>
         
        </Provider>
      </I18nextProvider>
    )
  }

}
