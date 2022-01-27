import React, { useEffect, useState } from "react";
import { Breadcrumb, SimpleCard } from "@gull";
import { connect } from 'react-redux';
import { getOrderView } from "app/redux/actions/OrderActions";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Form, Button, FormGroup, FormLabel } from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";
import { rootPath } from 'app/config';

import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import axios from 'axios';
import * as common from "app/services/common";

import { Formik } from "formik";

const MyItemComp = (props) => {

    useEffect(() => {
        props.getOrderView(defaultParams)
    }, [])
    const [offer, setOffer] = useState({
        category:[],
        subcategory:[],
        product:[],
        CheckboxStack:false
    })
    const [listData, setlistData] = useState([])
    const [exeonce, setexeonce] = useState(true);
    const [optionsCategoryName, setoptionsCategoryName] = useState([])
    const [optionsSubCategoryName, setoptionsSubCategoryName] = useState([])
    const [optionsProductName, setoptionsProductName] = useState([])
    const [flagonce, setflagonce] = useState(true)
    const [iinittableValue, setiinittableValue] = useState("Product List is empty")
    const defaultParams = {
        "member_id": props.match.params.memberId,
        "order_id": props.match.params.orderId
    }
    
    const [reqdata,setreqdata]= useState({
        "cat_ids": [],
        "sub_ids": [],
        "product_ids":[],
        "stock": 0
    })
    
    const testy=[
        axios.post("http://algrix.in:1430/report/product_report",reqdata )
                .then((res) => {
                    if(flagonce){
                        dropdownFun()
                        setflagonce(false)
                        var data = common.decryptJWT(res.data.token)
                        const __array = [];
                        setiinittableValue("Apply Filter")
                        // data.stock_data.map((el, i) => 
                        //     {
                        //         console.log(el);
                        //         let obj= {
                        //             is_default: el.is_default,_id:i,category:el.category,subcategory:el.subcategory,product_code:el.product_code,product_name:el.product_name,variant_name:el.variant_name,pack:el.pack,livestock:el.livestock,price:el.price
                        //         }
                        //         __array.push(obj)
                        //     }
                        // )
                        setlistData(__array);                    
                    }
                    return 0
                })
                .catch((err) => {
                    console.log(err.message);
                })

                  
    ]
   
    // Dropdown data
    const dropdownFun=()=>{
        
        if(exeonce){
            setexeonce(false)
                axios.post("http://algrix.in:1430/get_data",{"type":"category"} )
                .then((res) => {
                        var data = common.decryptJWT(res.data.token)
                        let op=[]
                        data.data.map((el, i) => 
                                {
                                    let obj= { label: el.category, value: el._id ,index:i,name:'cat_ids'}
                                    op.push(obj)
                                }
                            )
                            setoptionsCategoryName(op)
                        return 0;
                })
                .catch((err) => {
                    console.log(err.message);
                })   
                axios.post("http://algrix.in:1430/get_data",{"type":"subcategory"} )
                .then((res) => {
                        var data = common.decryptJWT(res.data.token)
                        let op=[]
                        data.data.map((el, i) => 
                                {
                                    let obj= { label: el.subcategory, value: el._id ,index:i,name:'sub_ids'}
                                    op.push(obj)
                                }
                            )
                            setoptionsSubCategoryName(op)
                        return 0;
                })
                .catch((err) => {
                    console.log(err.message);
                }) 
                let req={"cat_ids":[],"sub_ids":[],"type":"product"}
                axios.post("http://algrix.in:1430/get_data", req)
                .then((res) => {
                        var data = common.decryptJWT(res.data.token)
                        let op=[]
                        data.data.map((el, i) => 
                                {
                                    let obj= { label: el.name, value: el._id ,index:i,name:'product_ids'}
                                    op.push(obj)
                                }
                            )
                            setoptionsProductName(op)
                        return 0;
                })
                .catch((err) => {
                    console.log(err.message);
                })
        }
    }

    let sortableColumn = [
        {
            text: "S.No",
            formatter: (cell, row, index) => {
                return <>{index + 1}</>;
            },
            headerStyle: {
                width: '8%',
                textAlign: 'center',
            },
            classes: 'text-center',
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "category",
            text: "Category",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "subcategory",
            text: "Sub Category",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "product_code",
            text: "Product Code",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "product_name",
            text: "Product Name",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "variant_name",
            text: "Variant Name",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "pack",
            text: "Pack",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "livestock",
            text: "Live Stock",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "price",
            text: "Price",
            sort: false
        },
    ];

    let paginationOptions = {
        custom: false,
        paginationSize: 5,
        pageStartIndex: 1,
        firstPageText: "First",
        prePageText: "Back",
        nextPageText: "Next",
        lastPageText: "Last",
        nextPageTitle: "First page",
        prePageTitle: "Pre page",
        firstPageTitle: "Next page",
        lastPageTitle: "Last page",
        showTotal: true,
        totalSize: listData.length
    };

    const handleSubmit = (values) => {
        if(values){
            console.log(values )
                let cat_id=[],sub_id=[],product_id=[]
                values.category.forEach(data => {
                    cat_id.push(data.value)
                }); 
                values.product.forEach(data => {
                    product_id.push(data.value)
                });
                values.subcategory.forEach(data => {
                    sub_id.push(data.value)
                });
                let reqdataa={
                    "cat_ids": cat_id,
                    "sub_ids": sub_id,
                    "product_ids":product_id,
                    "stock": values.CheckboxStack?'1':'0'
                }
                listdata(reqdataa)
                console.log(reqdataa)
                
        }
        else{let reqdataa={
            "cat_ids": [],
            "sub_ids": [],
            "product_ids":[],
            "stock": 0
        }
        listdata(reqdataa)}
    }
    
    const reset=()=>{
        
        const __array = [];
        setiinittableValue("Apply Filter")
        setlistData(__array); 
    }
    const listdata=(req)=>{
        axios.post("http://algrix.in:1430/report/product_report",req )
                .then((res) => {
                        var data = common.decryptJWT(res.data.token)
                        const __array = [];
                        console.log(data)
                        data.stock_data.map((el, i) => 
                            {
                                console.log(el,i)
                                let obj= {
                                    is_default: el.is_default,_id:i,category:el.category,subcategory:el.subcategory,product_code:el.product_code,product_name:el.product_name,variant_name:el.variant_name,pack:el.pack,livestock:el.livestock,price:el.price
                                }
                                __array.push(obj)
                            }
                        )
                        console.log(__array)
                        setlistData(__array);                    
                        paginationOptions.totalSize=__array.length;

                    return 0
                })
                .catch((err) => {
                    console.log(err.message);
                })
    }
    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Reports", path: rootPath + "report/product-list" },
                    { name: "Product List" }
                ]}
            />
            {/* filter */}
            <SimpleCard>
            <Formik
                        enableReinitialize={true}
                        onSubmit={handleSubmit}
                        initialValues={{ ...offer }}
                    >
                        {({
                            values,
                            handleChange,
                            handleReset,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                        }) => {
                            return (
                                <Form
                                    onSubmit={handleSubmit}
                                    encType={`true`}
                                    autoComplete={false}
                                >
                    <div className="row">
                        <div className="col-md-12">
                            <Form.Row className="col-md-12 p-0">
                                <FormGroup className="col-md-4 ">
                                    <FormLabel className="font-weight-bold">Category Name </FormLabel>
                                    
                                    <MultiSelect
                                        options={optionsCategoryName}
                                        value={values.category}
                                        onChange={(e) => {
                                            setFieldValue('category', e)
                                        }}
                                        onBlur={handleBlur}
                                        label={"Select category"}
                                        name="category"
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-4 ">
                                    <FormLabel className="font-weight-bold">Sub Category Name </FormLabel>
                                    
                                    <MultiSelect
                                        options={optionsSubCategoryName}
                                        value={values.subcategory}
                                        onChange={(e) => {
                                            setFieldValue('subcategory', e)
                                        }}
                                        onBlur={handleBlur}
                                        label={"Select sub category"}
                                        name="subcategory"
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-4 ">
                                    <FormLabel className="font-weight-bold">product Name </FormLabel>
                                    
                                    <MultiSelect
                                        options={optionsProductName}
                                        value={values.product}
                                        onChange={(e) => {
                                            setFieldValue('product', e)
                                        }}
                                        onBlur={handleBlur}
                                        label={"Select product"}
                                        name="product"
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-4 mt-3" style={{ top: '7px', left: '5px' }}>
                                    <input
                                        type="checkbox"
                                        name='CheckboxStack'
                                        onChange={handleChange}
                                        value={values.CheckboxStack} checked={values.CheckboxStack}
                                    />&nbsp;&nbsp;&nbsp;
                                    <FormLabel className="font-weight-bold">Without zero Qty</FormLabel>
                                </FormGroup>
                                <FormGroup className="col-md-2 mt-3">
                                    <Button className="w-100" variant="outline-danger m-1 text-capitalize" type="submit">Search</Button>
                                </FormGroup>
                                <FormGroup className="col-md-2 mt-3">
                                    <Button className="w-100" variant="outline-primary m-1 text-capitalize"  onClick={(e) => {
                                            handleReset()
                                            reset()
                                        }}>Reset</Button>
                                </FormGroup>
                            </Form.Row>
                        </div>
                    </div>
                </Form>)}}
            </Formik>
            </SimpleCard>

{/* table */}
            <SimpleCard className='mt-4'>
                <ToolkitProvider
                    striped
                    keyField='_id'
                    data={listData}
                    columns={sortableColumn}
                >
                    {props => (
                        <>
                            <BootstrapTable
                                {...props.baseProps}
                                bootstrap4
                                className="table-responsive"
                                keyField='_id'
                                pagination={paginationFactory(paginationOptions)}
                                headerClasses="datatable-header"
                                noDataIndication={iinittableValue}

                            />
                        </>
                    )}
                </ToolkitProvider>
                <div class="d-none">
                <BootstrapTable
                                keyField='_id'
                    data={listData}
                    id="productListTable"
                    columns={sortableColumn}/>
                </div>
                <div class="text-right mt-4">
                    <ReactHTMLTableToExcel
                    id="ds"
                    className="download-table-xls-button btn btn-primary"
                    table="productListTable"
                    filename="productList"
                    sheet="tablexls"
                    buttonText="Download Excel"/>
                </div>
            </SimpleCard>
        </>
    )
}

function mapStateToProps(state) {
    return {
        orderView: state.order.orderView
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getOrderView: e => dispatch(getOrderView(e))
    };
}

const ProductList = connect(mapStateToProps, mapDispatchToProps)(MyItemComp)

export default ProductList;