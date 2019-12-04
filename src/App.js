import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Main from './components/Main';
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

const App = ({ title }) =>
  <div>
    <DndProvider backend={HTML5Backend}>
      <Main></Main>
    </DndProvider>
  </div>;

export default App;
