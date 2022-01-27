import React, { useEffect, useState } from "react";
import { Breadcrumb, SimpleCard } from "@gull";
import { connect } from 'react-redux';
import { getOrderView } from "app/redux/actions/OrderActions";
import { getOrderRegisterReport, getCustomerDropdownValues, getProductDropdownValues } from 'app/redux/actions/ReportActions';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Form, Button, FormGroup, FormLabel, FormControl, Badge } from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";
import { rootPath } from 'app/config';
import { Formik } from "formik";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const MyItemComp = (props) => {

    useEffect(() => {
        props.getOrderView(defaultParams);
        props.getProductDropdownValues({ cat_ids: [], sub_ids: [], type: 'product' });
        props.getCustomerDropdownValues();
    }, [])

    const defaultParams = {
        "member_id": props.match.params.memberId,
        "order_id": props.match.params.orderId
    }

    const orderStatusOptions = [
        { label: "Please Select", value: '' },
        { label: "Processed", value: 4 },
        { label: "Packing", value: 5 },
        { label: "Going To Delivery", value: 6 },
        { label: "Deliverd", value: 7 },
        { label: "Order Confirmed", value: 8 },
        { label: "Order Returned", value: 9 },
        { label: "Order Cancel", value: 10 },
        { label: "Out of Stock", value: 11 }
    ];


    let sortableColumn = [
        {
            text: "S.No",
            formatter: (cell, row, index) => {
                return <>{index + 1}</>;
            },
            headerStyle: {
                width: '5%',
                textAlign: 'center',
            },
            classNamees: 'text-center',
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "order_no",
            text: "Order No.",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "order_date",
            text: "Order Date",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "shop_name",
            text: "Shop Name",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "Customer_name",
            text: "Customer",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "delivered_to",
            text: "Delivered To",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "delviered_date",
            text: "Delivered Date",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "qty",
            text: "Qty",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "amount",
            text: "Amount",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center'
            },  
            formatter: (cell, row, index) => {
                return (row.order_status == 7 ? <Badge className="p-2 m-1 badge badge-success">Delivered </Badge> : 
                (row.order_status == 4 ? <Badge className="p-2 m-1 badge badge-dark">Processed</Badge> : 
                (row.order_status == 5 ? <Badge className="p-2 m-1 badge badge-danger">Packing</Badge> : 
                (row.order_status == 6 ? <Badge className="p-2 m-1 badge badge-warning">Going To Delivery</Badge> :
                 (row.order_status == 8 ? <Badge className="p-2 m-1 badge badge-dark">Order Confirmed</Badge> :
                  (row.order_status == 9 ? <Badge className="p-2 m-1 badge badge-warning">Order Returned</Badge>:
                  (row.order_status == 10 ? <Badge className="p-2 m-1 badge badge-danger">Order Cancel</Badge> :
                  (row.order_status == 11 ? <Badge className="p-2 m-1 badge badge-danger">Out Of Stock</Badge> : ''))))))));
            },
            text: "Status",
            dataField: "order_status",
            editable: false,
            classes: 'text-center',
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
        totalSize: props.orderRegisterReportList && props.orderRegisterReportList.length > 0 ? props.orderRegisterReportList.length : 0
    };

    const handleSubmit = (submitValues) => {
        props.getOrderRegisterReport(Object.assign({}, submitValues, {
            customer_ids: submitValues.customer_ids.map(_ => _.value),
            product_ids: submitValues.product_ids.map(_ => _.value)
        }));
    }


    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Reports", path: rootPath + "report/order-register" },
                    { name: "Order Register" }
                ]}
            />
            <SimpleCard>
                <Formik
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                    initialValues={{
                        "customer_ids": [],
                        "product_ids": [],
                        "from_date": "",
                        "to_date": "",
                        "order_number": "",
                        "order_status": "",
                        "type": 1
                    }}>
                    {({
                        values,
                        handleChange,
                        handleReset,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                        resetForm
                    }) => {
                        return (
                            <Form
                                onSubmit={handleSubmit}
                                encType={`true`}
                                autoComplete={false}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <Form.Row className="col-md-12 p-0">
                                            <FormGroup className="col-md-4 ">
                                                <input type="radio" name="action" defaultChecked={values.type === 1 || false} value="green" onChange={(e) => {
                                                    setFieldValue('type', 1);
                                                }} />
                                                <FormLabel className="font-weight-bold">Summary</FormLabel>
                                            </FormGroup>
                                            <FormGroup className="col-md-4 ">
                                                <input type="radio" name="action" defaultChecked={values.type === 2 || false} onChange={(e) => {
                                                    setFieldValue('type', 2);
                                                }} />
                                                <FormLabel className="font-weight-bold">Details</FormLabel>
                                            </FormGroup>
                                        </Form.Row>
                                        <Form.Row className="col-md-12 p-0">
                                            <FormGroup className="col-md-4 ">
                                                <FormLabel className="font-weight-bold">Product</FormLabel>
                                                <MultiSelect
                                                    options={props.productDropdownValues || []}
                                                    value={values.product_ids}
                                                    onChange={(e) => {
                                                        setFieldValue('product_ids', e);
                                                    }}
                                                    onBlur={handleBlur}
                                                    label={"Select product"}
                                                    name="product_ids"
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-4 ">
                                                <FormLabel className="font-weight-bold">Customer</FormLabel>
                                                <MultiSelect
                                                    options={props.customerDropdownValues || []}
                                                    value={values.customer_ids}
                                                    onChange={(e) => {
                                                        setFieldValue('customer_ids', e);
                                                    }}
                                                    onBlur={handleBlur}
                                                    label={"Select Customer"}
                                                    name="customer_ids"
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-4 ">
                                                <FormLabel className="font-weight-bold">Order Number </FormLabel>
                                                <FormControl
                                                    type="text"
                                                    className="form-control col-md-12"
                                                    name='order_number'
                                                    placeholder="Order Number"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        setFieldValue('order_number', e.target.value);
                                                    }}
                                                    value={values.order_number}
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-4 ">
                                                <FormLabel className="font-weight-bold">Order Status</FormLabel>
                                                <select
                                                    name="order_status"
                                                    className="col-md-12 dropDown"
                                                    onBlur={handleBlur}
                                                    value={values.order_status}
                                                    onChange={(e) => {
                                                        setFieldValue('order_status', e.target.value);
                                                    }}>
                                                    {(orderStatusOptions || []).map((Opt, OptIndex) => (<option key={OptIndex} value={Opt.value}>{Opt.label}</option>))}
                                                </select>
                                            </FormGroup>
                                            <FormGroup className="col-md-3">
                                                <FormLabel className="font-weight-bold">From Date</FormLabel>
                                                <FormControl
                                                    type="date"
                                                    className="form-control col-md-12"
                                                    onChange={(e) => {
                                                        setFieldValue('from_date', e.target.value);
                                                    }}
                                                    onBlur={handleBlur}
                                                    value={values.from_date}
                                                    name="from_date"
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-3">
                                                <FormLabel className="font-weight-bold">To Date</FormLabel>
                                                <FormControl
                                                    type="date"
                                                    className="form-control col-md-12"
                                                    onChange={(e) => {
                                                        setFieldValue('to_date', e.target.value);
                                                    }}
                                                    onBlur={handleBlur}
                                                    value={values.to_date}
                                                    name="to_date"
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 mt-3 pt-1">
                                                <Button className="w-100" variant="outline-danger m-1 text-capitalize" type="submit">Search</Button>
                                            </FormGroup>
                                            <FormGroup className="col-md-2 mt-3 pt-1">
                                                <Button className="w-100" variant="outline-primary m-1 text-capitalize" onClick={(e) => resetForm()}>Reset</Button>
                                            </FormGroup>
                                        </Form.Row>
                                    </div>
                                </div>
                            </Form>)
                    }}
                </Formik>
            </SimpleCard>

            <SimpleCard className='mt-4'>
                <ToolkitProvider
                    striped
                    keyField='_id'
                    data={props.orderRegisterReportList || []}
                    columns={sortableColumn}>
                    {props => (
                        <>
                            <BootstrapTable
                                {...props.baseProps}
                                bootstrap4
                                className="table-responsive"
                                keyField='_id'
                                pagination={paginationFactory(paginationOptions)}
                                headerClasses="datatable-header"
                                noDataIndication={"Order Register List is empty"}
                            />
                        </>
                    )}
                </ToolkitProvider>
                <div class="d-none">
                    <BootstrapTable
                        keyField='_id'
                        data={props.orderRegisterReportList || []}
                        id="orderRegisterReportList"
                        columns={sortableColumn} />
                </div>
                <div class="text-right mt-4">
                    <ReactHTMLTableToExcel
                        id="ds"
                        className="download-table-xls-button btn btn-primary"
                        table="orderRegisterReportList"
                        filename="orderRegisterReport"
                        sheet="tablexls"
                        buttonText="Export Excel" />
                </div>
            </SimpleCard>

        </>
    )
}

function mapStateToProps(state) {
    return {
        orderView: state.order.orderView,
        orderRegisterReportList: state.report.orderRegisterReportList,
        productDropdownValues: state.report.productDropdownValues,
        customerDropdownValues: state.report.customerDropdownValues
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getOrderView: e => dispatch(getOrderView(e)),
        getOrderRegisterReport: e => dispatch(getOrderRegisterReport(e)),
        getProductDropdownValues: e => dispatch(getProductDropdownValues(e)),
        getCustomerDropdownValues: e => dispatch(getCustomerDropdownValues(e))

    };
}

const OrderRegister = connect(mapStateToProps, mapDispatchToProps)(MyItemComp)

export default OrderRegister;