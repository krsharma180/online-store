import React from "react";
import {connect} from 'react-redux'
import { Form, Row, Col, Input, Button,Card,TreeSelect,
  Pagination, Select,List, Avatar, Descriptions,PageHeader, Tabs, Statistic,Divider } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { fetchProductSuggestion,insertProduct,uploadProductImages 
,fetchProductsAdmin, fetchSingleProduct} from "../../redux/product/productActions";
import { fetchCategoryData,fetchPlainCategoryData } from "../../redux/category/categoryActions";
import * as config from "../../config";
const { Option } = Select;
const { Meta } = Card;
const { TabPane } = Tabs;
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

class ViewProductsAdmin extends React.Component{
    formRef = React.createRef();

    state={
      filters:{},
      pageNumber:0,
      propsArr:[],
      propsFilter:[],
      expand:1,
      showSearchAndProduct:true
    }
     onFinish = (values) => {
        console.log('Received values of form: ', values);
      this.setState({
        filters:values
      })
        this.props.getAllProducts({filters:values,pageNumber:this.state.pageNumber,
        propsFilter:this.state.propsFilter})

      };

      resetFields=()=>{
        this.formRef.current.resetFields();

      }

      onCategoryChange=(val)=>{
            if(val){
            let category=this.props.plainCategoryData.find(x=>x.value==val)
            let catObj=this.props.propsArr.filter(x=>x.categoryId==category._id)
            this.setState({
              propsArr:[]
            },()=>{
              this.setState({
                propsArr:catObj
              })
            })
            }
            else{
              
            this.setState({
              propsArr:[]
            })
            }
        }

  componentDidMount=()=>{
      this.props.getAllProducts({})
      if(this.props.plainCategoryData.length==0){
        this.props.getPlainCategoryData();
      }
  }

  onPaginationChange=(val)=>{
    this.setState({pageNumber:val})
    this.props.getAllProducts({filters:this.state.filters,pageNumber:val})
  }
  onCategoryFilterChange=(name,values)=>{
    let propsFilter=this.state.propsFilter;
    let tmpObj={name:"",values:[]}
    propsFilter=propsFilter.filter(x=>x.name!==name)
    if(true){
      tmpObj.name=name;
      tmpObj.values=values;
      propsFilter.push(tmpObj)
    }
    else{
      // delete propsFilter[name]
      // propsFilter[name]=values
    }

    this.setState({
      propsFilter:propsFilter
    },()=>{console.log('Props filter:',this.state.propsFilter)})
    
  }

  getDescription=(Description,Price,Brand,VendorId)=>{
    return (
      <div style={{fontWeight:"50px"}}>
        <b>Description :</b> {Description}
        <br>
        </br>
        <b>Price :</b> {Price}
        <br>
        </br>
        <b>Brand :</b> {Brand}
        <br>
        </br>
        <b>Seller :</b> {VendorId}
      </div>
    )
  }

  onProductClick=(productId)=>{
    this.props.getSingleProduct({productId})
    
    this.setState({
      showSearchAndProduct:false
    })
  }

  onBackClick=()=>{
    this.setState({
      showSearchAndProduct:true
    })
  }

 Content = ({ children, extra }) => {
    return (
      <div className="content">
        <div className="main">{children}</div>
        <div className="extra">{extra}</div>
      </div>
    );
  };

   renderContent = (productData) => (
    <Descriptions size="default">
      <Descriptions.Item label="Description"><b>{productData.Description}</b></Descriptions.Item>
      <Descriptions.Item label="Seller">
        <a>{productData.VendorId?productData.VendorId.CompanyName:""}</a>
      </Descriptions.Item>
      <Descriptions.Item label="Brand"><b>{productData.Brand}</b></Descriptions.Item>
     
    
      {/* <Descriptions.Item label="Effective Time">2017-10-10</Descriptions.Item>
      <Descriptions.Item label="Remarks">
        Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
      </Descriptions.Item> */}
    </Descriptions>
  );

  renderCategoryPath=(arr)=>{
    if(arr){
    let ret= arr.map(i=>{
      return "->"+i
    })
    return ret
  }
  }

  getStats=()=>{
    return(
      <Card>
    <Row gutter={16}>
    <Col span={4}>
      <Statistic title="TOTAL ORDERS" value={150} />
    </Col>
    <Col span={4}>
      <Statistic title="NEW ORDERS" value={22} />
    </Col>
    <Col span={4}>
      <Statistic title="PENDING ORDERS" value={13} />
    </Col>
    <Col span={4}>
      <Statistic title="TOTAL SELL AMOUNT (₹)" value={"1,12,893 ₹"} precision={2} />
      {/* <Button style={{ marginTop: 16 }} type="primary">
        Recharge
      </Button> */}
    </Col>
  </Row>
  </Card>)
}

    render(){
    console.log('Props Aray',this.state.propsArr)
        return(
            <div style={{textAlign:"left",marginRight:10}}>
                {/* <Card> */}
                <div style={{display:this.state.showSearchAndProduct?"":"none"}}>
                 <Form ref={this.formRef} style={{padding:15}}
    //   form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={this.onFinish}
    >
      <Row gutter={24}>
      <Col span={6} key='Category'>
      <Form.Item name="category" label="Category:">
                    <TreeSelect 
                    allowClear
                    // dropdownStyle={{alignItems:"flex-start", maxHeight: 400, overflow: 'auto' }}
                    treeData={this.props.categoryData}
                    placeholder="Choose Product Category"
                    treeDefaultExpandAll
                    onChange={this.onCategoryChange}
                />
                        </Form.Item>
        </Col>

      <Col span={6} key='Name'>
          <Form.Item
            name='ProductName'
            label='Product Name'
          >
            <Input placeholder="Product Name" />
          </Form.Item>
        </Col>
          
        <Col span={6} key='Brand'>
          <Form.Item
            name='ProductBrand'
            label='Brand'
          >
            <Input placeholder="Brand" />
          </Form.Item>
        </Col>

        <Col span={6} key='Vendor'>
          <Form.Item
            name='Vendor'
            label='Vendor'
          >
            <Input placeholder="Vendor" />
          </Form.Item>
        </Col>


        <Col span={4} key='MinPrice'>
          <Form.Item
            name='MinPrice'
            label='Min Price'
          >
            <Input placeholder="Min" type="number" />
          </Form.Item>
        </Col>

        <Col span={4} key='MaxPrice'>
          <Form.Item
            name='MaxPrice'
            label='Max Price'
          >
            <Input placeholder="Max" type="number" />
          </Form.Item>
        </Col>


        <Col span={6} key='Date'>
          <Form.Item
            name='Date'
            label='Added Date'
          >
            <Input placeholder="Date" type="date" />
          </Form.Item>
        </Col>
        </Row>
        <Row gutter={24}>

{this.state.propsArr.map(i=>{
      return(
      <Col span={4} key={i.categoryId}>
      <Form.Item
        name={i.name}
        label={i.name}
      >
        <Select mode="tags" onChange={(value)=>{this.onCategoryFilterChange(i.name,value)}}>
          {i.values.map(j=>{
            return <Option value={j}>{j}</Option>
          })}
        </Select>
      </Form.Item>
    </Col>
      )
    })}
</Row>
      <Row>
        <Col
          span={24}
          style={{
            textAlign: 'right',
          }}
        >
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button
            style={{
              margin: '0 8px',
            }}
            onClick={() => {
              this.resetFields();
            }}
          >
            Clear
          </Button>
          <a
            style={{
              fontSize: 12,
            }}
            onClick={() => {
            //   setExpand(!expand);
            }}
          >
            {this.state.expand ? <UpOutlined /> : <DownOutlined />} Collapse
          </a>
        </Col>
      </Row>
    </Form>
    {/* </Card> */}
<br></br>
<Card>
    <Pagination size="small" defaultCurrent={1} onChange={this.onPaginationChange} total={this.props.totalProducts} />

    <List
    itemLayout="horizontal" style={{cursor:"pointer",fontSize:"50px"}}
    dataSource={this.props.allProductsData}
    renderItem={item => (
      <List.Item style={{cursor:"pointer",fontSize:"50px"}}
      //  actions={[<a key="list-loadmore-edit">See More</a>]}
       >
        <List.Item.Meta style={{fontSize:"50px"}}
        onClick={()=>{this.onProductClick(item._id)}}
          avatar=
          // {<img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" 
          {<img src={config.SERVER_IMAGES+item.Images[0]}

          width="150" height="150" />}
          title={<a onClick={()=>{this.onProductClick()}}>{item.ProductName}</a>}
          description={this.getDescription(item.Description,item.Price,item.Brand,item.VendorId)}
          
        />        
        
      </List.Item>
    )}
  />
  </Card>
  </div>
  <div className="ProductDetailsPageDiv" style={{display:this.state.showSearchAndProduct?"none":""}}>
  <PageHeader
      className="site-page-header-responsive"
      onBack={this.onBackClick}
      title={this.props.singleProductData.ProductName}
      subTitle={this.renderCategoryPath(this.props.singleProductData.CategoryPath)}
      extra={[
        <Button key="1" type="primary">
          Delete
        </Button>,
      ]}
      footer={
        <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Statistics" key="1">{this.getStats()}</TabPane>
          <TabPane tab="Order History" key="2" />
          <TabPane tab="Reviews" key="3" />
        </Tabs>
        </Card>
      }
    >
      <div>{this.renderContent(this.props.singleProductData)}</div>
      {
    this.props.singleProductData.CategoryId?( this.props.singleProductData.VariantIds.map(i=>{
                   return <div>
                    <Divider orientation="left">Variant #{this.props.singleProductData.VariantIds.indexOf(i)+1}</Divider>
                    <Descriptions bordered>
                    {i.Variants.map(j=>{
                        return <Descriptions.Item style={{color:"darkgrey",fontWeight:"bold"}} label={j.name}>{j.value}</Descriptions.Item>
                    })}
                      <Descriptions.Item label="Stock" style={{color:"darkgreen",fontWeight:"bolder"}}>{i.Stock}</Descriptions.Item>
                      <Descriptions.Item label="Price" style={{color:"darkgreen",fontWeight:"bolder"}}>{i.Price}</Descriptions.Item>

                    </Descriptions>
                    </div>
  })):""}
  <div className="Images">
<Divider orientation="left">Images</Divider>

    {this.props.singleProductData.Images?
this.props.singleProductData.Images.map(i=>{
        return <img width="100" alt="No Data" height="100" src={"http://localhost:4000/"+i}></img>
      }) :""}

  </div>
    </PageHeader>

  
  </div>
            </div>
        )
    }
}


const mapStateToProps = (state)=>{
    return{
        suggestionsloading:state.products.suggestionsloading,
        productSuggestions:state.products.productSuggestionsData,
        productSuggestionError:state.products.productSuggestionError,
        categoryData:state.categories.categoryData,
        plainCategoryData:state.categories.plaincategoryData,
        insertProductLoading:state.products.insertProductLoading,
        insertProductSuccessMsg:state.products.insertProductSuccessMessage,
        insertProductErrorMsg:state.products.insertProductErrorMessage,
        insertProductAdded:state.products.insertProductAdded,
        insertImagesLoading:state.products.inserImagesLoading,
        insertImagesSuccess:state.products.insertImagesSuccess,
        insertImagesError:state.products.insertImagesError,
        productsLoading:state.products.getProductsAdminLoading,
        productsLoadingError:state.products.getProductsAdminError,
        allProductsData:state.products.allProductsData,
        totalProducts:state.products.totalProductCount,
        propsArr:state.products.propsArr,
        singleProductData:state.products.singleProductData
    }
  }
  
  const mapDispatchToProps = dispatch =>{
    return{
        getProductSuggestions: ()=>{
            dispatch(fetchProductSuggestion())
        },
        getCategoryData: ()=>{
            dispatch(fetchCategoryData())
        },
        getPlainCategoryData: ()=>{
          dispatch(fetchPlainCategoryData())
      },
      insertProduct:(productData,imagesData)=>{
        dispatch(insertProduct(productData,imagesData))
      },
      uploadProductImages:(data)=>{
        dispatch(uploadProductImages(data))
      },
      getAllProducts:(filters)=>{
          dispatch(fetchProductsAdmin(filters))
      },
      getSingleProduct:(Id)=>{
        dispatch(fetchSingleProduct(Id))
      }

    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(ViewProductsAdmin)