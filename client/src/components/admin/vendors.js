import React from "react";
import { Tabs,
    message  } from 'antd';

import AddVendor from "./AddVendorSub";
import ViewVendors from "./ViewVendorSub";

const { TabPane } = Tabs;

class Seller extends React.Component{

    render(){
        return(
            <div style={{ marginLeft: 200,height:"" }}>
                <Tabs defaultActiveKey="1" size="large" style={{ marginBottom: 32,paddingLeft:15 }}>

                <TabPane tab="Add Vendor" key="1">
                  <AddVendor></AddVendor>
                
                </TabPane>
                <TabPane tab="View Vendors" key="2">
                <ViewVendors></ViewVendors>
                </TabPane>
                <TabPane tab="Pending Approval Products" key="3">
                
                </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Seller