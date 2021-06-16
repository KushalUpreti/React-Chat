import './App.css';
import SocketProvider from './contexts/socket-context';
import { useAuth } from './hooks/Auth-hook';
import AuthContext from "./contexts/auth-context";
import Signup from "./pages/Signup/Signup";
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

function App() {
  const { token, userDetails, login, logout } = useAuth();

  let routes = null;

  if (token) {
    routes = <>
      <Switch>
        <Route path="/">
          <SocketProvider>
            <Dashboard />
          </SocketProvider>
        </Route>
        <Redirect to="/"></Redirect>
      </Switch>
    </>;
  } else {
    routes = <>
      <Switch>
        <Route path="/signup"><Signup /></Route>
        <Route path="/login"><Login /></Route>
        <Redirect to="/signup"></Redirect>
      </Switch>
    </>;
  }


  return (
    <BrowserRouter basename="/ReactChat">
      <AuthContext.Provider value={{
        isLoggedIn: !!token,
        login,
        logout,
        token,
        username: userDetails.username || "",
        userId: userDetails.userId || null
      }}>
        <div className="App">
          {routes}
        </div>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
