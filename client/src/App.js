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

//using redux
import { useSelector } from 'react-redux';

function App() {
  //const authContext = useContext(AuthContext);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route
            path="/expenses"
            element={isLoggedIn ? <Expenses /> : <Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
