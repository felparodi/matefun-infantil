import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Toolbox from './components/Toolbox';
import Board from './components/Board';
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

const App = ({ title }) =>
  <div>
    <DndProvider backend={HTML5Backend}>
      <Toolbox></Toolbox>
      <Board></Board>
    </DndProvider>
  </div>;

export default App;
