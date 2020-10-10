import React from 'react'
import { Tabs,
   message  } from 'antd';

import AddProductAdmin from "./AddProductSub";
import ViewProductsAdmin from "./ViewProductsSub";

const { TabPane } = Tabs;

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


class Products extends React.Component{
 
    render(){
      
    
        return(
            <div style={{ marginLeft: 200,height:"" }}>
                <Tabs defaultActiveKey="1" size="large" style={{ marginBottom: 32,paddingLeft:15 }}>

                <TabPane tab="Add Product" key="1">
                  <AddProductAdmin></AddProductAdmin>
                
                </TabPane>
                <TabPane tab="View Products" key="2">
                <ViewProductsAdmin></ViewProductsAdmin>
                </TabPane>
                <TabPane tab="Pending Approval Products" key="3">
                
                </TabPane>
                </Tabs>
            </div>
        )
    }
}

// const mapStateToProps = (state)=>{
//     return{
//         suggestionsloading:state.products.suggestionsloading,
//         productSuggestions:state.products.productSuggestionsData,
//         productSuggestionError:state.products.productSuggestionError,
//         categoryData:state.categories.categoryData,
//         plainCategoryData:state.categories.plaincategoryData,
//         insertProductLoading:state.products.insertProductLoading,
//         insertProductSuccessMsg:state.products.insertProductSuccessMessage,
//         insertProductErrorMsg:state.products.insertProductErrorMessage,
//         insertProductAdded:state.products.insertProductAdded,
//         insertImagesLoading:state.products.inserImagesLoading,
//         insertImagesSuccess:state.products.insertImagesSuccess,
//         insertImagesError:state.products.insertImagesError
//     }
//   }
  
//   const mapDispatchToProps = dispatch =>{
//     return{
//         getProductSuggestions: ()=>{
//             dispatch(fetchProductSuggestion())
//         },
//         getCategoryData: ()=>{
//             dispatch(fetchCategoryData())
//         },
//         getPlainCategoryData: ()=>{
//           dispatch(fetchPlainCategoryData())
//       },
//       insertProduct:(productData,imagesData)=>{
//         dispatch(insertProduct(productData,imagesData))
//       },
//       uploadProductImages:(data)=>{
//         dispatch(uploadProductImages(data))
//       }
//     }
//   }
  // const CustomProducts = Form.create()(Products);

export default Products