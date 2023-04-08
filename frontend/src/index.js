import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './reducer/counterReducer';
import userReducer from './reducer/userReducer';

import { Provider } from 'react-redux';


const root = ReactDOM.createRoot(document.getElementById('root'));

export const store = configureStore({
  reducer: {
    user: userReducer
  },
})
root.render(
  <ChakraProvider>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
