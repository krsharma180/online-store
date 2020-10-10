import React from "react";
import { Tabs,Form, Input, Button, Space ,TreeSelect ,Typography,
    message,Upload, Modal , Radio,Alert,Card,Table ,
     Tag,Steps,Select ,Divider,Tooltip,
     List,Checkbox, Badge,Descriptions,PageHeader,Result   } from 'antd';
 import { SearchOutlined,MinusCircleOutlined, PlusOutlined,InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
 import { fetchProductSuggestion,insertProduct,uploadProductImages } from "../../redux/product/productActions";
 import { fetchCategoryData,fetchPlainCategoryData } from "../../redux/category/categoryActions";
 import {connect} from 'react-redux'
 import { styles } from "../../styles.css";
 import { formatCountdown } from 'antd/lib/statistic/utils';
 import DescriptionsItem from 'antd/lib/descriptions/Item';
 
 const { Text, Link } = Typography;
 const { TabPane } = Tabs;
 const { Step } = Steps;
 const { Option } = Select;
 const { TextArea } = Input;

 function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  
class AddProductAdmin extends React.Component{

    formRef = React.createRef();
    constructor(props){
        super(props)
        this.state = {
          value: undefined,
          isRootCategory:true,
          selectedRowKeys: [], // Check here to configure the default column
          // filteredInfo: null,
          searchText: '',
          searchedColumn: '',
          current: 0,
          fields:[
            //   {name:'Color',key:"Color",fieldKey:'Color'},
            //   {name:'Size',key:"Size",fieldKey:'Size'}
          ],
          createdProps:[],
          isCopyProp:false,
          previewVisible: false,
          FormDataForFiles:{},
          previewImage: '',
          previewTitle: '',
          fileList: [
            // {
            //   uid: '-1',
            //   name: 'image.png',
            //   status: 'done',
            //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
          ],
          tags: ['Unremovable', 'Tag 2', 'Tag 3'],
          inputVisible: false,
          inputValue: '',
          editInputIndex: -1,
          editInputValue: '',
          isProductSelectedFromSearch:false,
         
          productName:"",
          productCategoryId:0,
          productCategoryName:"",
          productCategoryPath:[],
          productDescription:"",
          productBrand:"",
          productPrice:0,
          productDiscount:0,

          categoryNameForSearch:"",
          categoryNameForDropdown:"",

          copiedProps:[]

      }
    }
    handleClose = removedTag => {
      const tags = this.state.tags.filter(tag => tag !== removedTag);
      console.log(tags);
      this.setState({ tags });
    };
  
    showInput = () => {
      this.setState({ inputVisible: true }, () => this.input.focus());
    };
  
    handleInputChange = e => {
      this.setState({ inputValue: e.target.value });
    };
  
    handleInputConfirm = () => {
      const { inputValue } = this.state;
      let { tags } = this.state;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      console.log(tags);
      this.setState({
        tags,
        inputVisible: false,
        inputValue: '',
      });
    };
  
    handleEditInputChange = e => {
      this.setState({ editInputValue: e.target.value });
    };
  
    handleEditInputConfirm = () => {
      this.setState(({ tags, editInputIndex, editInputValue }) => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
  
        return {
          tags: newTags,
          editInputIndex: -1,
          editInputValue: '',
        };
      });
    };
  
    saveInputRef = input => {
      this.input = input;
    };
  
    saveEditInputRef = input => {
      this.editInput = input;
    };
   getBase64=(file)=> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj);
      }
      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
    }

      next= ()=> {
        if(this.state.current===0){
          if(this.state.productName=="" || 
          this.state.productDescription=="" ||
          this.state.productBrand=="" || this.state.productCategoryId=="" ){
            message.error('Please provide all details',2)
            return;
          }
        }
        if(this.state.current===1){
          if(this.state.createdProps.length<1){
            message.error('Please add at least one feature !')
            return;
          }
        }
        if(this.state.current===2){
          message.info('Three')
          
        }
        const current = this.state.current + 1;
        this.setState({ current });
      }
    
      prev=()=> {
        const current = this.state.current - 1;
        this.setState({ current });
      }

      onProductNameChange=(val)=>{
        console.log('Product Name:',val.target.value)
        this.setState({
          productName:val.target.value
        })
      }
      onProductDescriptionChange=(val)=>{
        this.setState({
          productDescription:val.target.value
        })
      }
      onProductBrandChange=(val)=>{
        this.setState({
          productBrand:val.target.value
        })
      }

      onProductPriceChange=(val)=>{
        this.setState({
          productPrice:val.target.value
        })
      }

      onProductDiscountChange=(val)=>{
        this.setState({
          productDiscount:val.target.value
        },()=>{console.log('FINAL',this.state)})
      }
      onProductSearch=()=>{

      }

      onCategoryChange=(val)=>{
        if(val){
        let cat=this.props.plainCategoryData.filter(x=>x.value==val)[0]
          let tmp=cat;
          let arr=[];
          arr.push(cat.title)
          while(tmp.parentId>0){
            let i=this.props.plainCategoryData.find(x=>x.value===tmp.parentId)
            arr.push(i.title);
            tmp=i;
          }
          arr=arr.reverse();
          console.log('Array Category path:',arr)

        this.setState({
          productCategoryId:cat._id,        
          categoryNameForDropdown:cat.title,
          productCategoryPath:arr
        })
      }
      else{
        this.setState({
          productCategoryId:"",        
          categoryNameForDropdown:""
        })
    }
  }


      onProductSelectionChange=(val)=>{
        if(val){
        let Selectedproduct = this.props.productSuggestions.filter(x=>x._id==val)[0]
      let categoryNameForSearch=Selectedproduct.ProductName
        categoryNameForSearch=categoryNameForSearch+"(";
      categoryNameForSearch=categoryNameForSearch+Selectedproduct.CategoryPath.map(i=>{
        return i
      })
        categoryNameForSearch=categoryNameForSearch+")";


console.log('SEARCH CATEGORY NAME:',categoryNameForSearch)
        this.setState({
          productName:Selectedproduct.ProductName,
          productCategoryId:Selectedproduct.CategoryId,
          productCategoryPath:Selectedproduct.CategoryPath,
          isProductSelectedFromSearch:true,
          categoryNameForSearch:categoryNameForSearch
          })
        }
        else{
          this.setState({
            productName:"",
            productCategoryId:"",
            productCategoryPath:[],
            isProductSelectedFromSearch:false,
            categoryNameForSearch:""
          })
        }
      }

      onSuggestedPropChecked=(val)=>{
          if(val.target.checked){
            let fieldss=this.state.fields.concat({name:val.target.value,
                key:val.target.value,fieldKey:val.target.value,custom:'Nocustom'})  
            this.setState({
                fields:fieldss
            })
          }
          else{
            this.setState({fields: this.state.fields.filter(function(p) { 
                return p.name !== val.target.value
            })});
          }
        
      }
      addNewProp=()=>{
          let len=this.state.fields.length
        let fieldss=this.state.fields.concat({name:'Length'+len,key:'Length'+len,fieldKey:'Length'+len,custom:'custom'})  
        this.setState({
            fields:fieldss  
            }
          )
      }

      removeProp=(val)=>{
        console.log('REMOVE',val)
        this.setState({fields: this.state.fields.filter(function(p) { 
            return p.name !== val 
        })});
      }
      componentDidMount(){
          this.props.getProductSuggestions()
          this.props.getCategoryData();
          this.props.getPlainCategoryData();
      }
      componentDidUpdate(){
        //   console.log('updated')
      }
      onAddProps=(val)=>{
        console.log('VALUES',val)
        let finalObj={stock:0,price:0,discount:0,objArr:[]}
        let criteriaCount=0;
        let allValues=true;

        if(val.props){
        Object.keys(val.props).forEach(function(key){
          if(!val.props[key].prop || !val.props[key].value){
            allValues=allValues&&false;
            // return;
          }
          if(val.props[key].prop!=="" &&val.props[key].value!==""){
          if(val.props[key].isVariant){
            criteriaCount++;
          }
        }
        })
      }
      else{
        message.error('Plese enter all details')
      }

      if(!allValues){
        message.error('Please enter all values');
        return;
      }

      if(val.stock ===undefined || parseInt(val.stock)<=0 
        || parseInt(val.price)<=0 ||val.price ===undefined){
        message.error('Please enter valid Stock and Price');
        return;
      }
        if(criteriaCount>2){
          message.error('Cannot have more than 2 buy criteria for a product',2)
          return;
        }
        console.log('VALUES 2',val)

        Object.keys(val.props).forEach(function(key) {
          if(val.props[key].prop!=="" &&val.props[key].value!==""){
            console.log('INSIDE CHECK')
          let object={};
          object['name']=val.props[key].prop
          object['value']=val.props[key].value
          object['isBuyingCriteria']=val.props[key].isVariant
          finalObj.objArr.push(object);
          }
      });
      finalObj.stock=val.stock;
      finalObj.price=val.price;
      finalObj.discount=val.discount;
      console.log('FINALOBJ:',finalObj);

    if(finalObj.objArr.length>0){
        //HANDLE VALIDATION HERE PLEASEEE
        // console.log('ANSWER',finalObj)
        let tmpArr=[...this.state.createdProps]
        let tmpcratedProps={stock:0,propsArr:[],Id:0,isChecked:false};
        tmpcratedProps.stock=finalObj.stock;
        tmpcratedProps.price=finalObj.price;
        tmpcratedProps.discount=finalObj.discount;
        tmpcratedProps.propsArr=finalObj.objArr;
        tmpcratedProps.Id=this.state.createdProps.length+1;
        tmpArr.push(tmpcratedProps)
        this.setState({
            createdProps:tmpArr,
            fields:[]
        })

      
        message.success('Added Successfully', 2)

    }
    this.formRef.current.resetFields();
        // console.log('Updated state:',this.state.createdProps)
      }
      onMyPropsCheckChange=value=>{
          let arr=this.state.createdProps.map(i=>{
            if(i.Id==value.target.name){
              if(value.target.checked===true){
                i.isChecked=true
              }
              else{
                i.isChecked=false
              }
              return i
            }
            return i
          })

          this.setState({
            createdProps:arr
          })
      }

      onRemoveCreatedProp=()=>{
        let filteered=this.state.createdProps.filter(j=>j.isChecked===false)
        this.setState({
          createdProps:filteered
        })
        message.info('Removed Successfully', 2)

      }

      addSimilarProp=()=>{
        let propToCopy=this.state.createdProps.filter(x=>x.isChecked===true)
        let fieldsToCopy=[]
        console.log('PROP TO COPY:',propToCopy)
        this.setState({
          isCopyProp:true,
          fields:[]
        })

        propToCopy[0].propsArr.map(i=>{
        let fieldss={name:i.name,key:i.name,fieldKey:i.name,custom:'custom',value:i.value,
        isVariant:i.isBuyingCriteria,price:i.price,discount:i.discount,stock:i.stock}
          fieldsToCopy.push(fieldss)
        })

        this.setState({
          isCopyProp:true,
          fields:fieldsToCopy,
          copiedProps:fieldsToCopy
        })
        console.log('FINAL COPY ARRAY:',fieldsToCopy)
        // message.success('Added Successfully', 2)
        // this.setState({
        //   isCopyProp:false
        // })
      }
      handleChange = ({ fileList }) =>{
         this.setState({ fileList });
         console.log(this.state.fileList)
        //  let formData=new FormData()
        //  this.state.fileList.forEach(i=>{
        //     formData.append('file',i.file)
        //  })
        //  this.setState({
        //    FormDataForFiles:formData
        //  },()=>{
        //    console.log('Form data: ',this.state.FormDataForFiles)
        //  })
      }

      onStockChange=()=>{

      }

      onAddProduct=()=>{
        let product={
          ProductName:this.state.productName,
          CategoryId:this.state.productCategoryId,
          Brand:this.state.productBrand,
          Description:this.state.productDescription,
          CategoryPath:this.state.productCategoryPath,
          ImagesFormData:this.state.FormDataForFiles,
          insertedByEmail:localStorage.getItem('email'),
          Tags:this.state.tags,
          Variants:[],
          MoreProps:[]
        }
        this.state.createdProps.map(i=>{
          let variant={
            price:i.price,
            stock:i.stock,
            variants:[]
          }
          i.propsArr.map(j=>{
            variant.variants.push({name:j.name,value:j.value,isBuyingCriteria:j.isBuyingCriteria})
          })
          product.Variants.push(variant);
        })

        const formData=new FormData();
        formData.append('productData',product)

        for(var x = 0; x<this.state.fileList.length; x++) {
          formData.append('file', this.state.fileList[x])
      }

        this.setState({
          FormDataForFiles:formData
        })
        this.props.insertProduct(product,this.state.fileList);
        // this.props.uploadProductImages(formData)
        console.log("CREATED PRODUCT:",product)
      }

      handleChangeCustomUploader=event=>{
        this.setState({ fileList:event.target.files },()=>{
        console.log("FIles:",this.state.fileList)

        });
      }

      addAnotherProductReload=()=>{
          window.location.reload();
      }

      render(){
        let data1=[];
        let tmpdata1=[];
        const { tags, inputVisible, inputValue, editInputIndex, editInputValue } = this.state; //for tags
        const { previewVisible, previewImage, fileList, previewTitle } = this.state; //for file upload
        const uploadButton = (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )
        if(this.props.suggestionsloading==false && tmpdata1.length===0){
            this.props.productSuggestions.map(i=>{
              if(i.CategoryId===this.state.productCategoryId){
                i.MoreProps.map(j=>{
                    if(!tmpdata1.find(k=>k.key==j.name)){
                        tmpdata1.push(<Checkbox value={j.name} onChange={this.onSuggestedPropChecked}
                            key={j.name}><b>{j.name}</b> : {j.value}</Checkbox>)
                    }
                })
              }
            });
            console.log('Valuestmp:',tmpdata1)
        }
       
        const steps = [
            {
              title: 'First',
              content: <Card style={{margin:10,minHeight:"500px"}}> 
              <Form name="dynamic_form_nest_item" autoComplete="off">
                           
                           <Alert showIcon style={{marginBottom:15}} type="info" message="Use this page only to add a new product. If you wish to update the
                           stock, change features and variants, Go to View Products and Edit the desired product"></Alert>
                            
                            <Form.Item label="Search Products" style={{width:'50%'}}>
                                <Select placeholder="Enter Product Name" allowClear showSearch
                                 onSearch={this.onProductSearch} value={this.state.categoryNameForSearch}
                                  onChange={this.onProductSelectionChange}
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }>
                                    {this.props.productSuggestions.map(i=>{
                                       return <Option key={i._id}>{i.ProductName 
                                      //   +" ("+
                                      //  i.CategoryPath.map(j=>{
                                      //      return j
                                      //  })+")"
                                       }
                                       
                                       </Option>
                                    })}

                                </Select>
                            </Form.Item>
                            <Divider orientation="left" style={{width:'30%'}}>OR</Divider>
                            
                            <Form.Item  style={{ width: '30%' }} name="category" label="Choose Category:"
                             rules={[{ required: false,
                                message:'Missing Parent Category' }]}>
                            <TreeSelect disabled={this.state.isProductSelectedFromSearch}
                           allowClear
                            // value={this.state.categoryNameForDropdown}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.props.categoryData}
                            placeholder="Choose Product Category"
                            treeDefaultExpandAll
                            onChange={this.onCategoryChange}
                            defaultValue={this.state.categoryNameForDropdown}
                            // rules={[{ required: true, message: 'Missing Category Name' }]}
                        />
                                </Form.Item>
                       <Form.Item label="Product Name"  style={{ width: '30%' }}>
                        <Input placeholder="Enter Name"
                         disabled={this.state.isProductSelectedFromSearch} allowClear 
                         onChange={this.onProductNameChange}
                         value={this.state.productName} />
                       </Form.Item>

                       <Form.Item label="Product Description"  style={{ width: '30%' }}>
                        <TextArea placeholder="Enter Description"
                        value={this.state.productDescription} allowClear onChange={this.onProductDescriptionChange} />
                       </Form.Item>

                       <Form.Item label="Brand"  style={{ width: '30%' }}>
                        <Input placeholder="Enter Brand" value={this.state.productBrand} 
                        allowClear onChange={this.onProductBrandChange} />
                       </Form.Item>

                       {/* <Form.Item label="Price"  style={{ width: '30%' }}>
                        <Input placeholder="Enter Price" type="number" onBlur={this.onProductPriceChange} 
                          prefix="₹"
                          suffix={
                            <Tooltip title="Extra information">
                              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                          }/>
                       </Form.Item>

                       <Form.Item label="Discount"  style={{ width: '30%' }}>
                        <Input placeholder="Enter Discount" type="number" onBlur={this.onProductDiscountChange}
                       prefix="₹"
                          suffix={
                            <Tooltip title="Extra information">
                              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                          } />
                       </Form.Item> */}
        
                        </Form>
                        </Card>
            },








            {
              title: 'Second',
              content: <Card style={{margin:10,minHeight:"500px"}}>
                  <Card.Grid hoverable={false} style={{width:"30%",minHeight:"400px",paddingTop:0}}
                   title="Suggested Features">
                    <Divider orientation="left">Suggested Features <Badge count={tmpdata1.length}></Badge> </Divider>
                    <List style={{margin:0,padding:0,height:200,overflowY:"scroll"}}
                        size="small"
                        // header={<div style={{}}><b>Suggested Features</b></div>}
                        bordered
                        dataSource={tmpdata1}
                        renderItem={item => <List.Item>{item}</List.Item>}
                        style={{disabled:"true"}}
                        />
                    <Divider orientation="left">Features Added by You <Badge count={this.state.createdProps.length}></Badge></Divider>
                    <List style={{margin:0,padding:0,height:200,overflowY:"scroll"}}
                        size="small" className=""
                        bordered
                        dataSource={this.state.createdProps.map(i=>{
                            return <Checkbox name={i.Id} onChange={this.onMyPropsCheckChange}>
                                {i.propsArr.map(j=>{return j.name+" : "+j.value+", "})}{"Stock : "+i.stock+", "}
                                {"Price : "+i.price+", "}{"Discount : "+i.discount}</Checkbox>})}
                        renderItem={item => <List.Item>{item}</List.Item>}
                        />
                        <div style={{marginTop:2}}>
                        
                        <Button type="primary" disabled={this.state.createdProps.filter(j=>j.isChecked===true).length!==1}
                         style={{backgroundColor:""}} onClick={this.addSimilarProp} size="small">Add a Copy</Button>
                        
                        <Button style={{backgroundColor:"",marginLeft:3}}
                        onClick={this.onRemoveCreatedProp} danger type="primary"
                        disabled={this.state.createdProps.filter(j=>j.isChecked===true).length===0}
                        size="small">Remove {this.state.createdProps.filter(f=>f.isChecked===true).length>0?
                          this.state.createdProps.filter(f=>f.isChecked===true).length:""}</Button></div>
                  </Card.Grid>

                  <Card.Grid hoverable={false} style={{width:"70%",minHeight:"400px"}} title="Your Features" type="inner">
                   <Form onFinish={this.onAddProps} ref={this.formRef}
                    >
                    
                  <Form.List name="props">
        {(fields, { add, remove }) => {
          return (
            <div>
              {this.state.fields.map(field => (
                
                <Space key={field.key} style={{ display: 'flex', marginBottom: 2 }} align="start">
                  <Form.Item
                    {...field}
                    name={[field.name, 'prop']}
                    fieldKey={[field.fieldKey, 'prop']}
                    // label='Category Name:'
                    // rules={[{ required: true, message: 'Missing Feature Name' }]}
                    initialValue={
                      !this.state.isCopyProp?
                      tmpdata1.find(j=>j.key==field.name)?
                      field.name
                      :""
                      :field.name 
                   }
                  >
                    {
                    this.state.copiedProps.find(j=>j.key==field.name)?
                    <Input placeholder="Feature Name"  disabled={true}/>
                    :<Input placeholder="Feature Name"/>}

               
                  </Form.Item>


                  <Form.Item style={{display:"none"}}
                     {...field}
                    name={[field.name, field.custom]}
                    fieldKey={[field.fieldKey, field.custom]}>
                    {
                  tmpdata1.find(j=>j.key==field.name)?
                  <Input></Input>
                    :<Input></Input>
                  }

                        
                    </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'value']}
                    fieldKey={[field.fieldKey, 'value']}
                    // rules={[{ required: true, message: 'Missing last name' }]}
                    initialValue={
                      this.state.isCopyProp?
                      field.value:""
                    }
                  >
                    <Input placeholder="Value"/>
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'isVariant']}
                    fieldKey={[field.fieldKey, 'isVariant']}
                    label="Is Variant ?"
                    initialValue={this.state.isCopyProp?field.isVariant:false}
                    valuePropName="checked"
                    // rules={[{ required: true, message: 'Missing last name' }]}
                  >
                    {
                    this.state.copiedProps.find(j=>j.key==field.name)?
                    <Checkbox disabled={true}/>
                    :<Checkbox/>}

                  </Form.Item>
                    {
                      this.state.isCopyProp? this.setState({isCopyProp:false}):""
                    }

                    {
                       !tmpdata1.find(j=>j.key==field.name)?
                       <MinusCircleOutlined
                       onClick={() => {
                         this.removeProp(field.name);
                       }}
                     />:""
                    }
                 
                </Space>
              ))}
              <Form.Item>
                <Button style={{width:"30%",marginLeft:0,left:0}}
                  type="dashed"
                onClick={this.addNewProp}
                  block
                >
                  <PlusOutlined /> Add New field
                </Button>
              </Form.Item>
            </div>
          );
        }}
        
      </Form.List>
      <Form.Item label="Stock:" name="stock"  style={{ width: '30%' }}>
        <Input placeholder="Enter Quantity" type="number" onChange={this.onStockChange} 
            defaultValue="0"
            suffix={
            <Tooltip title="Extra information">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
            }/>
        </Form.Item>

        <Form.Item label="Price:" name="price" style={{ width: '30%' }}>
        <Input placeholder="Enter Price" type="number" onChange={this.onProductPriceChange} 
             defaultValue="0"
             prefix="₹"
            suffix={
            <Tooltip title="Extra information">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
            }/>
        </Form.Item>

        <Form.Item label="Discount:" name="discount"  style={{ width: '30%' }}>
        <Input placeholder="Enter Discount" type="number" onChange={this.onProductDiscountChange} 
            defaultValue="0"
            prefix="₹"
           suffix={
            <Tooltip title="Extra information">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
            }/>
        </Form.Item>

                       <Form.Item>
        <Button disabled={this.state.fields.length==0} type="primary" htmlType="submit" style={{margin:0,marginLeft:100}}>
          Add
        </Button>
      
      </Form.Item>

      </Form>
                  </Card.Grid>
                   
              </Card>,
            },







            {
              title: 'Third',
              content: <Card style={{margin:10,minHeight:"500px"}}>
                <Card title="Upload Images" hoverable={false} type="inner" style={{width:""}}>
                {/* <Upload 
          //       multiple
          // action="http://localhost:4000/api/products/uploadImages"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={beforeUpload}
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload> */}
        <input type="file" name="file" multiple onChange={this.handleChangeCustomUploader}/>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
                </Card>
                <Card title="Add Search tags" hoverable={false} type="inner" style={{width:"",marginTop:15}}>
                <Alert showIcon style={{marginBottom:15}} type="info"
                 message="Adding search tags enhances your product visibility to the customers. We highly recommend 
                 you adding tags that are descriptive and relevant."></Alert>
                         
                <>
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={this.saveEditInputRef}
                key={tag}
                size="small"
                className="tag-input"
                value={editInputValue}
                onChange={this.handleEditInputChange}
                onBlur={this.handleEditInputConfirm}
                onPressEnter={this.handleEditInputConfirm}
              />
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag
              className="edit-tag"
              key={tag}
              closable
              color="cyan"
              style={{marginBottom:5}}
              onClose={() => this.handleClose(tag)}
            >
              <span
                onDoubleClick={e => {
                  if (index !== 0) {
                    this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                      this.editInput.focus();
                    });
                    e.preventDefault();
                  }
                }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{width:"30%"}}
            className="tag-input"
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag color="magenta" style={{cursor:"pointer"}} className="site-tag-plus" onClick={this.showInput}>
            <PlusOutlined /> New Tag
          </Tag>
        )}
      </>

                </Card>
              </Card>,
            },











            {
                title: 'Last',
                content: <Card style={{margin:10,minHeight:"500px"}}>
                  <PageHeader
                  title={this.state.productName}
                  subTitle= {" ["+this.state.productCategoryPath+"]"}
                  extra={[
                    <Alert type="info" message="To edit this product, go back to previous steps"
                    showIcon></Alert>
                  ]}
                  style={{margin:0,padding:0}}>

                  </PageHeader>
                  <Divider orientation="left">Details</Divider>
                  <Descriptions>
                    <Descriptions.Item label="Description">{this.state.productDescription}</Descriptions.Item>
                    <Descriptions.Item label="Brand">{this.state.productBrand}</Descriptions.Item>
                  </Descriptions>

                  {this.state.createdProps.map(i=>{
                   return <div>
                    <Divider orientation="left">Variant #{this.state.createdProps.indexOf(i)+1}</Divider>
                    <Descriptions bordered>
                    {i.propsArr.map(j=>{
                        return <Descriptions.Item style={{color:"darkgrey",fontWeight:"bold"}} label={j.name}>{j.value}</Descriptions.Item>
                    })}
                      <Descriptions.Item label="Stock" style={{color:"darkgreen",fontWeight:"bolder"}}>{i.stock}</Descriptions.Item>

                    </Descriptions>
                    </div>
                  })}

                  <Divider orientation="left">Search Tags</Divider>
                  {this.state.tags.map(tag=>{
                    return <Tag closable={false} color="green">{tag}</Tag>
                  })}
                </Card>,
            },
          ];
        
        const { current } = this.state;

        return(
            <div>
                     <div style={{textAlign:"left",marginRight:10}}>
            
            <Steps size="small" current={this.state.current} style={this.props.insertImagesLoading?{display:""}:{display:"none"}}>
            <Step key="1" title="Add Product Details">
               
            </Step>

            <Step key="2" title="Add Variants, Features">
                Add variants
            </Step>

            <Step key="3" title="Add Images and Tags">
                Add Search terms
            </Step>

            <Step key="4" title="Review Product">
                Review Product
            </Step>
            </Steps>

            <div style={this.props.insertImagesLoading?{display:""}:{display:"none"}} className="steps-content">{steps[current].content}</div>
    <div className="steps-action" style={this.props.insertImagesLoading?{display:""}:{display:"none"}}>
      {current < steps.length - 1 && (
        <Button type="primary" onClick={() => this.next()}>
          Next
        </Button>
      )}
      {current ===steps.length - 1 && (
        <Button type="primary" onClick={this.onAddProduct}>
          Finish & Add Product
        </Button>
      )}
      {current > 0 && (
        <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}>
          Previous
        </Button>
      )}
    </div>
            </div>
            <div>
            <Result style={this.props.insertImagesLoading?{display:"none"}:{display:""}}
              status="success"
              title="Product Successfully Added!"
              subTitle="Product ID: 2017182818828182881"
              extra={[
                <Button type="primary" key="console" onClick={this.addAnotherProductReload}>
                  Add another Product
                </Button>,
                // <Button key="buy">Buy Again</Button>,
              ]}
            />
            </div>

            <div>
            <Result style={this.props.insertImagesError 
            || this.props.insertProductErrorMessage?
            {display:""}:{display:"none"}}
              status="500"
              title="Error Adding Product!"
              subTitle={this.props.insertImagesError , this.props.insertProductErrorMessage}
              extra={[
                <Button type="primary" key="console" onClick={this.addAnotherProductReload}>
                  Try Again
                </Button>,
                // <Button key="buy">Buy Again</Button>,
              ]}
            />
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
        insertImagesError:state.products.insertImagesError
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
      }
    }
  }
  export default connect(mapStateToProps,mapDispatchToProps)(AddProductAdmin)