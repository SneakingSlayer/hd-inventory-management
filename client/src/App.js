import React, {useContext} from "react";
import {Context} from './context/Context'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from "./pages/Products";
import Trucks from "./pages/Trucks";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import ViewOrder from "./pages/ViewOrder";
import Register from "./pages/Register"
import Error404 from "./pages/Error404";
import Verify from "./pages/Verify";
import {PrivateRoute} from './privateroutes/PrivateRoute'
import Employees from "./pages/Employees";
function App() {
  const {user} = useContext(Context)

  if(window.location.pathname === "/" && user !== null)
    window.location.href = "/dashboard"
  if(window.location.pathname === "/" && user === null)
    window.location.href = "/login"

  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={Dashboard}/>
        <PrivateRoute exact path="/dashboard" component={Dashboard}/>
        <PrivateRoute exact path="/trucks" component={Trucks}/>
        <PrivateRoute exact path="/products" component={Products}/>
        <PrivateRoute exact path="/orders" component={Orders}/>
        <PrivateRoute exact path="/orders/client/:id" component={ViewOrder}/>
        <PrivateRoute exact path="/employees" component={Employees}/>
        <Route exact path ="/verify/:token" component={Verify}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route component={Error404}/>
      </Switch> 
    </Router>
  );
}

export default App;
