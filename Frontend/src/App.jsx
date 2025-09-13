import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRoutes from './routes/Routes';
import ScrollToTop from './components/common/ScrollToTop';
import AuthInitializer from './components/auth/AuthInitializer';
import './App.css';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AuthInitializer>
          <ScrollToTop />
          <AppRoutes />
        </AuthInitializer>
      </Router>
    </Provider>
  );
};

export default App;