import './App.css';
import SocketProvider from './contexts/socket-context';
import AuthProvider from './contexts/auth-context';
import Signup from "./components/Signup";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { useContextObj } from './contexts/auth-context';

function App() {
  let auth = useContextObj();

  let loggedOutRoutes = <>
    <Switch>
      <Route path="/signup"><Signup /></Route>
      <Route path="/login"><Login></Login></Route>
      <Redirect to="/signup"></Redirect>
    </Switch>
  </>;

  let loggedInRoutes = <>
    <Switch>
      <Route path="/" exact>
        <SocketProvider>
          <Dashboard />
        </SocketProvider>
      </Route>
      <Redirect to="/"></Redirect>
    </Switch>
  </>;

  return (
    <BrowserRouter>

      <AuthProvider>
        <div className="App">
          {auth.isLoggedIn ? loggedInRoutes : loggedOutRoutes}
        </div>
      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;
