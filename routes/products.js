const express = require("express");
const router = express.Router();
const ProductModel = require('../models/product');
const NavbarModel = require('../models/category');
const VariantsModel = require('../models/variants');
const SellerModel = require('../models/seller');

const {
    User,
    validate
} = require("../models/user");
const _=require('lodash');
const mongoose = require("mongoose");
const multer=require('multer')

router.post("/GetAllProducts", async (req, res) => {
    console.log(req.body)
    let skipRows=req.body.pageNumber*15-15;

    const allProducts=await ProductModel.find({CategoryPath:req.body.AllProductsCategory_Filter});

    let productsCount=allProducts.length;

    const minPrice=Math.min.apply(Math, allProducts.map(function(o) { return o.Price; }))
    const maxPrice=Math.max.apply(Math, allProducts.map(function(o) { return o.Price; }))
    const priceRange=[];
    priceRange.push(minPrice)
    priceRange.push(maxPrice)

    let brands = allProducts.map(a => a.Brand);
    let uniquesBrands= _.uniqBy(brands,obj=>obj);

    let propsArr=[];

    for(let i=0;i<allProducts.length;i++){
        
        for(let j=0;j<allProducts[i].MoreProps.length;j++){
            let propsObj={
                name:"",
                values:[]
            }
            propsObj.name=allProducts[i].MoreProps[j].name;
            let found=propsArr.some(obj=>obj.name===allProducts[i].MoreProps[j].name)
            if(!found) propsArr.push(propsObj)

            let obj= propsArr.find(o=>o.name===allProducts[i].MoreProps[j].name)
            if(obj.values.indexOf(allProducts[i].MoreProps[j].value)===-1){
                obj.values.push(allProducts[i].MoreProps[j].value)
            }
        }
    }

    if(req.body.FilterApplied===0){
       
        const products=await ProductModel.find({CategoryPath:req.body.AllProductsCategory_Filter})
        .skip(skipRows).limit(15).sort('-CategoryRank');

        res.send({productsData:products,priceRange:priceRange,brands:uniquesBrands,
            totalCount:productsCount,propsArr:propsArr})
    }
    else{
        let dynamicFilter={

        }
        dynamicFilter['CategoryPath']=req.body.AllProductsCategory_Filter;
      
        if(req.body.AllProductsPriceRange_Filter.length>0){
            if(req.body.AllProductsPriceRange_Filter[0]>0){
                dynamicFilter['Price']={$gte:parseInt(req.body.AllProductsPriceRange_Filter[0]) , 
                    $lte:parseInt(req.body.AllProductsPriceRange_Filter[1])}
            }
        }

        if(req.body.AllProductsBrands_Filter.length>0){
                dynamicFilter['Brand']={$in:req.body.AllProductsBrands_Filter}
        }

        let morePropsFilter=[];

        if (req.body.AllProductsMoreProps_Filter.length>0) {
            req.body.AllProductsMoreProps_Filter.map(i=>{
                morePropsFilter.push({"MoreProps.name":i.name,
                        "MoreProps.value":{
                            $in: i.values
                        }    
            })
            })
        }
        let productsold;
        if (morePropsFilter.length>0) {
         
         productsold= ProductModel.find(dynamicFilter)
        .and({$and:morePropsFilter})
        .skip(skipRows).limit(15).sort('-CategoryRank')
   
        }
        else{
            productsold= ProductModel.find(dynamicFilter)
            .skip(skipRows).limit(15).sort('-CategoryRank')    
        }
        const products=await productsold.exec();

        const tmpproducts=await ProductModel.find(dynamicFilter).countDocuments().lean();

        res.send({productsData:products,priceRange:priceRange,brands:uniquesBrands,
            totalCount:tmpproducts,propsArr:propsArr})
    }
});

router.get("/GetSingleProduct", async (req, res) => {
    const product = await ProductModel.findOne({
        _id:req.query.id
    }).populate({
        path: 'ReviewId',   
        model: 'ProductReviews'
    })
    .populate({
        path:'VariantIds',
        model:'Variants'
    })
    .populate({
        path:'VendorId',
        model:'Vendors'
    })
    // console.log(product);
    res.send(product);
});

router.get("/getProductsForSuggestion", async (req, res) => {

    let result=await ProductModel.find().lean();  
    res.send(result);
});


router.post("/insertProduct", async (req, res) => {
    console.log(req.body.Variants[0].variants)
    let product=req.body;
    let variants=[];
    // let user=await User.findOne({email:req.body.insertedByEmail}).lean();
    let user=await SellerModel.findOne({Email:req.body.insertedByEmail}).lean();

    req.body.Variants.map(i=>{
        let obj={Price:0,Stock:0,VendorId:"",Variants:[]};
        obj.Price=i.price;
        obj.Stock=i.stock;
        obj.Variants=i.variants;
        obj.VendorId=user._id;
        product['MoreProps'].push(i.variants.map(j=> {return j}));
        variants.push(obj)
    });
    product.Price=req.body.Variants[0].price;
    product.Stock=req.body.Variants[0].stock;
    product['MoreProps']=[].concat.apply([],product['MoreProps'])
    // console.log('PRODUCT:',product)

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
    console.log("Starting transaction...")
   
    const addedVariants = await VariantsModel.create(variants,{session:session}) 
    let variantIds=addedVariants.map(i=>{
        return i._id
    })

    delete product.Variants
    product['VariantIds']=variantIds;
    product['IsFeatured']=false;
    product['VendorId']=user._id;
    product['InsertedBy']=user._id;

    const addedProduct = await ProductModel.create([product],{session:session})
    
    variantIds.map(async j=>{
        let updated = await VariantsModel.updateOne({
            _id:j
        },{ProductId:addedProduct[0]._id},{session:session})
    })

  
    //  throw new Error("Error")     

     session.commitTransaction();
     
     const insertedProduct=await ProductModel.findOne({_id:addedProduct[0]._id})
     .populate([{path:'VariantIds',model:'Variants'}])

     console.log("Committed transaction...")
    res.send(insertedProduct)

    
    } catch (error) {
        console.log("Error. Aborting transaction..",error)
        await session.abortTransaction();
        session.endSession()
        console.log("Aborted transaction!!")

    }    
});

let storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/')
    },
    filename:function(req,file,cb){
        let filename=Date.now()+"_"+file.originalname;
        cb(null,filename)
        req.fileNames=req.fileNames+","+filename
    }
})

let upload=multer({storage:storage}).array('file')


router.post("/uploadImages", upload,async (req, res) => {
        console.log("BODY:",req.body)
     let type=req.body.type;
     let productOrVariantIdOrName=req.body.productId
     
    upload(req,res,async function(err){
        if(err instanceof multer.MulterError){
            console.log('Multer Error uploading file',err)
            res.status(500).send('Could not upload images. Multer Error',err)
        }
        else if(err){
            console.log('Error uploading file',err)
            res.status(500).send('Could not upload images. Multer Error',err)
        }
        
        if(req.fileNames){
            if(type==='product'){
                let imagesArray=req.fileNames.split(',')
                imagesArray=imagesArray.filter(x=>x!=='undefined')
                
                let productToUpdate=await ProductModel.update({_id:productOrVariantIdOrName},{
                    Images:imagesArray
                });
                if(productToUpdate.n>0){
                    res.send('Images uploaded successfully')
                }
                else{
                    res.status(500).send('Error updating image paths to db(but Images physically uploaded)')
                }
                console.log('Files uploaded',productToUpdate)
            }
            if(type==='variant')
            {
                //Handle variants images upload here
            }
        }
    })
})

router.post("/GetAllProductsAdmin", async (req, res) => {
    let filters=req.body.filters
    let skipRows=0;
    if(req.body.pageNumber>0){
        skipRows=req.body.pageNumber*15-15;
    }
    // console.log("REQUESTED",filters,"PAGE NUMBER:",req.body.pageNumber)
    const allProducts=await ProductModel.find();

    // let totalCount=allProducts.length;

    let propsArr=[];

    for(let i=0;i<allProducts.length;i++){
        
        for(let j=0;j<allProducts[i].MoreProps.length;j++){
            let propsObj={
                categoryId:"",
                name:"",
                values:[]
            }
            propsObj.name=allProducts[i].MoreProps[j].name;
            propsObj.categoryId=allProducts[i].CategoryId;

            let found=propsArr.some(obj=>obj.name===allProducts[i].MoreProps[j].name)
            if(!found) propsArr.push(propsObj)

            let obj= propsArr.find(o=>o.name===allProducts[i].MoreProps[j].name)
            if(obj.values.indexOf(allProducts[i].MoreProps[j].value)===-1){
                obj.values.push(allProducts[i].MoreProps[j].value)
            }
        }
    }

    if(filters){
        // if(filters.length>0){
            let categoryName;
            if(filters.category){
            const category= await NavbarModel.find({value:filters.category}).lean();
            categoryName=category[0].title
            }
            const products = ProductModel.find()
            if(filters.ProductName) products.and({ProductName:{ $regex:  new RegExp(filters.ProductName, "i") }});
            if(filters.ProductBrand) products.and({Brand:{ $regex:  new RegExp(filters.ProductBrand, "i") }});
            if(filters.MinPrice) products.and({Price:{$gte:filters.MinPrice}})
            if(filters.MaxPrice) products.and({Price:{$lte:filters.MaxPrice}})
            if(categoryName) products.and({CategoryPath:{$in:[categoryName]}})
            
            // if(req.body.propsFilter){
            //     console.log('PROPS FILTER',req.body.propsFilter[0])
            //     products.and({
            //         'MoreProps.name':'Battery',
            //     'MoreProps.value' : {$in:['4000']}})
            // }
            if(req.body.propsFilter){
                if(req.body.propsFilter.length>0){
                for (let index = 0; index < req.body.propsFilter.length; index++) {
                    const values = req.body.propsFilter[index].values;
                    const name = req.body.propsFilter[index].name;
                    console.log('Name:',name,'values:',values)
                    if(values.length>0){
                        products.and({
                            'MoreProps.name':name,
                            'MoreProps.value':{$in:values}
                        })
                    }
                }
            }
         }

            const productsRet= await products
            .skip(skipRows).limit(15);
        // console.log('filter called',productsRet.length)
    let totalCount=productsRet.length;
            
            res.send({products:productsRet,totalCount:totalCount,propsArr:propsArr})
            
        // }
    }
    else{
        const products = await ProductModel.find()
        .skip(skipRows).limit(15);
    let totalCount=products.length;

        res.send({products:products,totalCount:totalCount,propsArr:propsArr})
    }
})

router.post("/GetSingleProductAdmin", async (req, res) => {

    const product = await ProductModel.findOne({
        _id:req.body.productId
    }).populate({
        path: 'ReviewId',   
        model: 'ProductReviews'
    })
    .populate({
        path:'VariantIds',
        model:'Variants'
    })
    .populate({
        path:'VendorId',
        model:'Vendors'
    })
    // console.log(product);
    res.send(product);
});

module.exports=router