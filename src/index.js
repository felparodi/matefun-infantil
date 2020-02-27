import React from 'react';
import ReactDOM from 'react-dom';
import './type';
import App from './App.jsx';

const title = 'Matefun Infantil';

ReactDOM.render(
  <App title={title} />,
  document.getElementById('app')
);

module.hot.accept();
