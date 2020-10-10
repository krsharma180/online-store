import React from "react";
import { Tabs,Form, Input, Button, Space ,TreeSelect ,Typography,Radio,Alert,Tree,Card,Table, Tag } from 'antd';
import { SearchOutlined,MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchCategoryData,insertCategoryData,fetchPlainCategoryData } from "../../redux/category/categoryActions";
import {connect} from 'react-redux'
const { Text, Link } = Typography;
const { TabPane } = Tabs;

const { Column, ColumnGroup } = Table;
function callback(key) {
    console.log(key);
  }
  const data = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Brown',
      age: 50,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      id: '2',
      firstName: 'Jim',
      lastName: 'Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      id: '3',
      firstName: 'Joe',
      lastName: 'Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      id: '4',
      firstName: 'Jill',
      lastName: 'Gill',
      age: 20,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      id: '5',
      firstName: 'JAssi',
      lastName: 'JAisi',
      age: 21,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

class Category extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      value: undefined,
      isRootCategory:true,
      selectedRowKeys: [], // Check here to configure the default column
      // filteredInfo: null,
      searchText: '',
      searchedColumn: '',
    }
  }

   onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

   onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  componentDidMount(){
    this.props.getCategoryData()
    this.props.getPlainCategoryData()
  }

  componentDidUpdate(){
    // this.props.getCategoryData()
  }

  onFinish = values => {
    console.log('Received values of form:', values);
    if(values.categoryType===undefined) values.categoryType='root'

    let categoryArr=[];
    if(values.categories){
      values.categories.map(i=>{
        let obj={
          label: i.category,
          title:i.category,
          parentId: values.categoryType=='root'? 0 :values.category
        }
        categoryArr.push(obj)
      })
      console.log('OK',categoryArr)
      this.props.insertCategoryData(categoryArr,()=>{
        this.props.getCategoryData()
    this.props.getPlainCategoryData()
      })
      // this.props.getCategoryData()
      // this.props.getPlainCategoryData()
    }

  };

  onChange = value => {
    console.log(value);
    this.setState({ value });
  };

  onCategoryTypeChange = value=>{
    if(value.target.value=='root'){
      this.setState({
        isRootCategory:true
      })
    }
    if(value.target.value=='child'){
      this.setState({
        isRootCategory:false
      })
    }

  }

  onCell = value=>{
    console.log('on cell',value)
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

    getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ?
      //  (
      //   <Highlighter
      //     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
      //     searchWords={[this.state.searchText]}
      //     autoEscape
      //     textToHighlight={text ? text.toString() : ''}
      //   />
      // ) 
      text
      : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };


    render(){
  console.log('Plain data',this.props.plainCategoryData)

      const columns = [
        {
          title: 'Name',
          dataIndex: 'title',
          key: 'title',
          // onFilter: (value, record) => record.name.includes(value),
          // filters:[{text:"Ashish",value:"Ashish"},{text:"Aashish",value:"Aashish"},{text:"Babban",value:"Babban"}],
          sorter: (a,b)=>{return a.title.localeCompare(b.title)},
          ...this.getColumnSearchProps('title')
        },
        {
          title: 'Parent',
          dataIndex: 'parentName',
          key: 'parentName',
          sorter: (a, b) => {return a.parentName.localeCompare(b.parentName)},
          ...this.getColumnSearchProps('parentName')

        }
      ];

      return(
            <div style={{backgroundColor:""}}>
            <div style={{ marginLeft: 200,height:"" }}>
                 <Tabs defaultActiveKey="1" size="large" style={{ marginBottom: 32,paddingLeft:15 }}>

          <TabPane tab="Add Categories" key="1">
            <div style={{textAlign:"left"}}>
            {this.props.categoryInserted ? (
        <Alert
        message={this.props.categoryInsertedResult.map(i=>{ return <div>Category <b>{i.label}</b> added<br/></div>})} 
        type="success" style={{marginBottom:10}} closable />
      ) : null}

{this.props.categoryInsertedError.length>0 ? (
        <Alert
        message={this.props.categoryInsertedError} type="error" style={{marginBottom:10}} closable />
      ) : null}

          <Form name="dynamic_form_nest_item" onFinish={this.onFinish} autoComplete="off">
          
          <Form.Item name="categoryType" label="Category Type:" rules={[{ required: false }]}>
        <Radio.Group defaultValue="root" buttonStyle="solid" onChange={this.onCategoryTypeChange}>
        <Radio.Button value="root">Root Category</Radio.Button>
          <Radio.Button value="child">Child Category</Radio.Button>
        </Radio.Group>
      </Form.Item>

          <Form.Item name="category" label="Parent Category:" rules={[{ required: !this.state.isRootCategory,
            message:'Missing Parent Category' }]}>
          {/* <Text>Select Category: </Text> */}
          <TreeSelect
        style={{ width: '30%' }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={this.props.categoryData}
        placeholder="Choose Category"
        treeDefaultExpandAll
        onChange={this.onChange}
        disabled={this.state.isRootCategory}
        // rules={[{ required: true, message: 'Missing Category Name' }]}
      />
            </Form.Item>
      <Form.List name="categories">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map(field => (
                <Space key={field.key} style={{ display: 'flex', marginBottom: 5 }} align="start">
                  <Form.Item
                    {...field}
                    name={[field.name, 'category']}
                    fieldKey={[field.fieldKey, 'category']}
                    label='Category Name:'
                    rules={[{ required: true, message: 'Missing Category Name' }]}
                  >
                    <Input placeholder="Enter Name" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'comment']}
                    fieldKey={[field.fieldKey, 'comment']}
                    // rules={[{ required: true, message: 'Missing last name' }]}
                  >
                    <Input placeholder="Comment" />
                  </Form.Item>

                  <MinusCircleOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                </Space>
              ))}

              <Form.Item>
                <Button style={{width:"30%",height:50,marginLeft:100,left:0}}
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  // disabled={this.state.isRootCategory}
                  block
                >
                  <PlusOutlined /> Add field
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{margin:0,marginLeft:100}}>
          Add
        </Button>
      </Form.Item>
    </Form>
    </div>
          </TabPane>
          <TabPane tab="View Categories" key="2">

          <Tabs type="card">
          <TabPane tab="Table View" key="1">
            <Table size="small" style={{marginLeft:15,marginRight:15}}
             dataSource={this.props.plainCategoryData} 
             columns={columns}
             bordered={true}
             pagination={{position:['topLeft']}}>
            </Table>
          </TabPane>
          <TabPane tab="Tree View" key="2">
          <Tree
      defaultExpandedKeys={this.props.categoryData.length>0? this.props.categoryData.map(i=>{return i.key}):['']}
      treeData={this.props.categoryData}
      style={{marginLeft:20}}
    />
    </TabPane>
            </Tabs>
            {/* <Card bordered={true} style={{width:"100%"}}>
            
    <Card type="inner" bordered={true} hoverable={false} style={{width:"",margin:0,padding:0}}>

    <Table dataSource={this.props.plainCategoryData} columns={columns}>
    
  </Table>

</Card>
<Card hoverable={false} type="inner" title="Tree Structure" style={{width:"25%",borderBottom:"0px"}}>
          <Tree
      defaultExpandedKeys={this.props.categoryData.length>0? this.props.categoryData.map(i=>{return i.key}):['']}
      treeData={this.props.categoryData}
    />
    </Card>
    </Card> */}
          </TabPane>
         
          <TabPane tab="Pending Approvals" key="3"> 
            Content of tab 3
          </TabPane>
          
        </Tabs>
            </div>
            </div>
        )
    }
}


const mapStateToProps = (state)=>{
  return{
      categoryData:state.categories.categoryData,
      categoryInserted:state.categories.categoryInserted,
      categoryInsertedResult:state.categories.categoryInsertedResult,
      categoryInsertedError:state.categories.error,
      plainCategoryData:state.categories.plaincategoryData
  }
}

const mapDispatchToProps = dispatch =>{
  return{
      getCategoryData: ()=>{
          dispatch(fetchCategoryData())
      },
      insertCategoryData:(categoryArr,callback)=>{
          dispatch(insertCategoryData(categoryArr,callback))
      },
      getPlainCategoryData:()=>{
        dispatch(fetchPlainCategoryData())
      }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Category)