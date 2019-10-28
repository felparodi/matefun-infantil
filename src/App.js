import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Toolbox from './toolbox/Toolbox';
import Board from './board/Board';

const App = ({ title }) =>
  <div>
    <Toolbox></Toolbox>
    <Board></Board>
  </div>;

export default App;