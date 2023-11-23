import { createContext } from 'react';

const AppContext = createContext({
  user: null,
  userData: null,
  isLoading: true,
  setContext() {
    // real implementation comes from App.jsx
  },
});

export default AppContext;