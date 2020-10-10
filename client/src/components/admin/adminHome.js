import React from "react";
import  {Link,BrowserRouter, Router,Redirect}  from "react-router-dom";
import  AdminSideBar  from "../admin/sidebar";

class AdminHome extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>
              <AdminSideBar></AdminSideBar>
            </div>
        )
    }
}

export default AdminHome