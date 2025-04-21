import { useContext } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Expenses from './Components/Expenses/Expenses';

import { AuthContext } from './Components/Auth/AuthContext';
import Auth from './Components/Auth/Auth';
function App() {
  const authContext = useContext(AuthContext);
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route
            path="/expenses"
            element={
              authContext.isLoggedIn ? (
                <Expenses />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
