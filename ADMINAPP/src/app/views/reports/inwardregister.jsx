import React, { useEffect, useState } from "react";
import { Breadcrumb, SimpleCard } from "@gull";
import { connect } from 'react-redux';
import { getOrderView } from "app/redux/actions/OrderActions";
import { getInwardRegisterReport, getProductDropdownValues, getVendorDropdownValues } from 'app/redux/actions/ReportActions';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Form, Button, FormGroup, FormLabel, FormControl, Badge } from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";
import { rootPath } from 'app/config';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Formik } from "formik";

const MyItemComp = (props) => {
    console.log('inwrd Register Props', props);

    useEffect(() => {
        props.getOrderView(defaultParams);
        props.getProductDropdownValues({ cat_ids: [], sub_ids: [], type: 'product' });
        props.getVendorDropdownValues();
    }, []);

    const inwardRegisterReportList = props.inwardRegisterReportList || [];

    const defaultParams = {
        "member_id": props.match.params.memberId,
        "order_id": props.match.params.orderId
    }


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
            dataField: "inward_date",
            text: "Inward Date",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "inward_no",
            text: "Inward No.",
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
                return (row.status === 1 ? <Badge className="p-2 m-1 badge badge-success">Verified </Badge> : 
                (row.status === 2 ? <Badge className="p-2 m-1 badge badge-dark">In Active</Badge> : 
                (row.status === 3 ? <Badge className="p-2 m-1 badge badge-danger">Delete</Badge> : 
                (row.status === 4 ? <Badge className="p-2 m-1 badge badge-warning">In Progress</Badge> :
                 (row.status === 5 ? <Badge className="p-2 m-1 badge badge-danger">Rejected</Badge> :
                  (row.status === 6 ? <Badge className="p-2 m-1 badge badge-light">Hold</Badge>:
                  (row.status === 0 ? <Badge className="p-2 m-1 badge badge-light">Blocked</Badge> : '')))))));
            },
            text: "Status",
            dataField: "status",
            editable: false,
            classes: 'text-center',
            sort: false
        }
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
        totalSize: inwardRegisterReportList.length
    };

    const handleSubmit = (submitValues) => {
        props.getInwardRegisterReport({
            ...submitValues,
            "vendor_ids": submitValues.vendor_ids.map(_ => _.value),
            "product_ids": submitValues.product_ids.map(_ => _.value)
        });
    }

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Reports", path: rootPath + "report/inward-register" },
                    { name: "Inward Register" }
                ]}
            />

            <SimpleCard>

                <Formik
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                    initialValues={{
                        "vendor_ids": [],
                        "product_ids": [],
                        "from_date": "",
                        "to_date": "",
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
                                                <FormLabel className="font-weight-bold">Vendor</FormLabel>
                                                <MultiSelect
                                                    options={props.vendorDropdownValues || []}
                                                    value={values.vendor_ids}
                                                    onChange={(e) => {
                                                        setFieldValue('vendor_ids', e);
                                                    }}
                                                    onBlur={handleBlur}
                                                    label={"Select Vendor"}
                                                    name="vendor_ids"
                                                />
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
                            </Form>
                        )
                    }
                    }
                </Formik>


            </SimpleCard>

            <SimpleCard className='mt-4'>
                <ToolkitProvider
                    striped
                    keyField='_id'
                    data={inwardRegisterReportList}
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
                                noDataIndication={"Inward Register List is empty"}
                            />
                        </>
                    )}

                </ToolkitProvider>
                <div class="d-none">
                    <BootstrapTable
                        keyField='_id'
                        data={inwardRegisterReportList || []}
                        id="inwardRegisterReportList"
                        columns={sortableColumn} />
                </div>
                <div class="text-right mt-4">
                    <ReactHTMLTableToExcel
                        id="ds"
                        className="download-table-xls-button btn btn-primary"
                        table="inwardRegisterReportList"
                        filename="inwardRegisterReport"
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
        inwardRegisterReportList: state.report.inwardRegisterReportList,
        productDropdownValues: state.report.productDropdownValues,
        vendorDropdownValues: state.report.vendorDropdownValues
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getOrderView: e => dispatch(getOrderView(e)),
        getInwardRegisterReport: e => dispatch(getInwardRegisterReport(e)),
        getProductDropdownValues: e => dispatch(getProductDropdownValues(e)),
        getVendorDropdownValues: e => dispatch(getVendorDropdownValues(e))
    };
}

const InwardRegister = connect(mapStateToProps, mapDispatchToProps)(MyItemComp)

export default InwardRegister;