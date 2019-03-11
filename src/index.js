import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import firebase from 'firebase';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import authReducer from './store/reducers/auth';
import formulaReducer from './store/reducers/formula';
import databaseReducer from './store/reducers/database';
import resultsReducer from './store/reducers/result';
import inventoryReducer from './store/reducers/inventory';
import registerServiceWorker from './registerServiceWorker';
import './index.css';


//Only allow REDUX Devtools in the Development environment
const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET
};
firebase.initializeApp(config);

const rootReducer = combineReducers({
    auth: authReducer,
    formula: formulaReducer,
    results: resultsReducer,
    database: databaseReducer,
    inventory: inventoryReducer
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
