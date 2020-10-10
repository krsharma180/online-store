import React from "react";
import { Tabs,
    message,
    Form,
    Input,
    Tooltip,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete,  } from 'antd';
    
import { QuestionCircleOutlined } from '@ant-design/icons';
import { insertSeller } from "../../redux/seller/sellerActions";   
import {connect} from 'react-redux'

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;
const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        {/* <Option value="86">+86</Option>
        <Option value="87">+87</Option> */}
      </Select>
    </Form.Item>
  );

class AddVendor extends React.Component{
    
onFinish=(values)=>{
    console.log('VALUES:',values)
    this.props.insertSeller(values)
}
    render(){
        return(
            <div style={{width:"50%"}}>
                  <Form
      onFinish={this.onFinish}
      initialValues={{
        residence: ['zhejiang', 'hangzhou', 'xihu'],
        prefix: '+91',
        rights:false
      }}
      scrollToFirstError
    >
      <Form.Item
        name="VendorName"
        label={
          <span>
            Vendor Name&nbsp;
            <Tooltip title="Enter Vendor Name">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[
          {
            required: true,
            message: 'Please input your nickname!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="CompanyName"
        label={
          <span>
            Company Name&nbsp;
            <Tooltip title="Enter Company Name">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[
          {
            required: true,
            message: 'Please input company name!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone1"
        label="Mobile Number 1"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item
        name="phone2"
        label="Mobile Number 2"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item
        name="Address"
        label={
          <span>
            Company Address&nbsp;
            <Tooltip title="Enter Company Name">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[
          {
            required: true,
            message: 'Please input company name!',
            whitespace: true,
          },
        ]}
      >
        <TextArea />
      </Form.Item>

      <Form.Item
        name="District"
        label={
          <span>
            City/District&nbsp;
            <Tooltip title="Enter District">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[
          {
            required: true,
            message: 'Please input district!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="State"
        label={
          <span>
            State&nbsp;
            <Tooltip title="Enter State">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[
          {
            required: true,
            message: 'Please input state!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="rights" valuePropName="rights">
        <Checkbox>Give Insertion Rights?</Checkbox>
      </Form.Item>

     

      <Form.Item 
    //   {...tailFormItemLayout}
      >
        <Button type="primary" htmlType="submit">
          Add Vendor
        </Button>
      </Form.Item>
    </Form>
            </div>
        )
    }
} 

const mapStateToProps = (state)=>{
    return{
        insertSellerLoading:state.seller.insertSellerLoading,
        insertSellerAdded:state.seller.insertSellerAdded,
        insertSellerSuccessMessage:state.seller.insertSellerSuccessMessage,
        insertSellerErrorMessage:state.seller.insertSellerErrorMessage
    }
  }
  
  const mapDispatchToProps = dispatch =>{
    return{
        insertSeller: (sellerData)=>{
            dispatch(insertSeller(sellerData))
        },
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(AddVendor)