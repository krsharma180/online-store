import React from "react";
import { Layout, Menu, Breadcrumb,Badge } from 'antd';
import  {Link,BrowserRouter, Router,Redirect}  from "react-router-dom";
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    DatabaseOutlined
  } from '@ant-design/icons';
  import { styles } from "../../styles.css";

  
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
class AdminSideBar extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            collapsed: false,
          };
    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
      };

      // componentDidMount(){
      //   if(localStorage.getItem('authToken')){
      //     console.log('GOT AUTH TOKEN')
      //     const role= localStorage.getItem('role')
      //     if(role==1){
      //       this.setState({referrer: '/AdminHome/'});
      //     }
      //     else if (localStorage.getItem('role')==2){
      //       this.setState({referrer: '/VendorHome/'});
      //     }
      //     else{
      //       console.log('Could not identify')
      //     }
      //   }
      //   else{
      //     console.log('NO AUTH TOKEN')

      //     this.setState({referrer: '/login/'});

      //   }
      // }


    render(){
      const {referrer} = this.state;
      if (referrer) return <div><Redirect to={referrer} /></div>;

        return (
          
            <div>
               {/* <Layout  style={{ minHeight: '100vh' }}> */}
                   <Sider  collapsed={this.state.collapsed} onCollapse={this.onCollapse}
                   style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0, 
                    // margin: "16px"
                  }} className="scrollbar style-4 wrapper">
                   <div className="logo" >
                  <h2>  E - STORE</h2>   
                    </div>

                   <Menu theme="dark"
                    // defaultOpenKeys={['1']}
                     defaultSelectedKeys={['1']}
                    mode="inline">
            <Menu.Item key="1" defaultChecked icon={<PieChartOutlined />}>
              
              <Link to={{pathname:`/DashBoardAdmin/`}}>Dashboard
              </Link>
            </Menu.Item>

            <SubMenu key="master" icon={<DatabaseOutlined />} title="Master Data">
              <Menu.Item key="11">
              
              <Link to={{pathname:`/Category/`}}>Categories
              </Link>
              <Badge style={{marginLeft:"10px"}} count={9}>
              </Badge>
              </Menu.Item>
              
              <Menu.Item key="12">
              <Link to={{pathname:`/Products/`}}>Products
              </Link>
              <Badge style={{marginLeft:"10px"}} count={6}>
              </Badge>
              </Menu.Item>
              <Menu.Item key="13">
              <Link to={{pathname:`/Seller/`}}>Vendors
              </Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              Vendors
            </Menu.Item>
          </Menu>
          </Sider>
                   <Layout className="site-layout" style={{ marginLeft: 200 }}>
                       {/* <Header style={{height:"50px"}} >
                         <Menu theme="dark" style={{alignContent:"flex-end"}}>
                           <Menu.Item key="2" icon={<DesktopOutlined />}>
                              Log Out
                           </Menu.Item>
                         </Menu>
                       </Header> */}
                        {/* <Content style={{ margin: '16px 16px 0',  overflow: 'initial'}}>
                        <div className="site-layout-background" style={{ textAlign: 'center' }}>
                        Some data
                        </div>
                
                        </Content> */}
                   </Layout>
               {/* </Layout> */}
            </div>
        )
    }
}

export default AdminSideBar