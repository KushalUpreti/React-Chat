import './App.css';
import SocketProvider from './contexts/socket-context';
import { useAuth } from './hooks/Auth-hook';
import AuthContext from "./contexts/auth-context";
import Signup from "./components/Signup";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

function App() {
  const { token, userDetails, login, logout } = useAuth();

  let routes = <>
    <Switch>
      <Route path="/signup"><Signup /></Route>
      <Route path="/login"><Login></Login></Route>
      <Redirect to="/signup"></Redirect>
    </Switch>
  </>;

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
  }


  return (
    <BrowserRouter>
      <AuthContext.Provider value={{
        isLoggedIn: !!token,
        login,
        logout,
        token,
        username: userDetails.username,
        userId: userDetails.userId
      }}>
        <div className="App">
          {routes}
        </div>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
