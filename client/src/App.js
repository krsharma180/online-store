import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as serviceWorker from './serviceWorker';
import  Login  from "../src/components/login/login";
import  AdminHome  from "../src/components/admin/adminHome";
import  VendorHome  from "../src/components/vendor/vendorHome";
import Category  from "../src/components/admin/category";
import Seller  from "../src/components/admin/vendors";
import Products  from "../src/components/admin/products";
import AdminSideBar from '../src/components/admin/sidebar'
import AdminDashboard from '../src/components/admin/adminDashboard'
import { BrowserRouter,Link,Route,Router,Switch,Redirect} from "react-router-dom";
import { createBrowserHistory } from 'history'
import { Provider } from "react-redux";
import  store  from "./redux/store";
const DefaultContainer=()=>(
  <div>
    <AdminSideBar></AdminSideBar>
      <Route path="/AdminHome" exact component={AdminHome}></Route>
      <Route path="/Seller" exact component={Seller}></Route>
      <Route path="/Category" exact component={Category}></Route>
      <Route path="/Products" exact component={Products}></Route>
      <Route path="/DashBoardAdmin" exact component={AdminDashboard}></Route>

  </div>
)
function App() {
  return (
    <div className="App">
        
      <BrowserRouter history={createBrowserHistory()}>
      <Provider store={store}>

    <Switch>
    <Route path="/(login|signup|forgot-password|reset-password)" render={({ location }) => (
        <Switch>
          <Route path="/login" component={Login} />
        </Switch>
    )} />
      <Route path="/" component={DefaultContainer}></Route>  
      
      </Switch>
      </Provider>

    </BrowserRouter>
    </div>
  );
}

export default App;
