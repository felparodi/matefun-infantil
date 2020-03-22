
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import matrixReducer from './matrix/matrixReducer';
import userReducer from './user/userReducer';
import environmentReducer from './environment/environmentReducer';

export const middlewares = [thunk];
export const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export const reducers = combineReducers({ user: userReducer, matrix: matrixReducer, environment: environmentReducer});

const store = createStoreWithMiddleware(
  reducers,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);


//store.subscribe(()=> console.log("STATE", store.getState()));

export default store;
