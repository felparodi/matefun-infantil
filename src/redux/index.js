
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import matrix from './matrix/reducer';


export const middlewares = [thunk];
export const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export const reducers = combineReducers({matrix});

const store = createStoreWithMiddleware(
  reducers,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
