import React, { useEffect, useState } from "react";
import { Breadcrumb, SimpleCard } from "@gull";
import { connect } from 'react-redux';
import { getOrderView } from "app/redux/actions/OrderActions";
import { getCustomerReport } from "app/redux/actions/ReportActions";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import {
    Form,
    Button,
    FormGroup,
    FormLabel,
    FormControl,
    Badge
} from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";
import { rootPath } from 'app/config';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Formik } from "formik";

const MyItemComp = (props) =>  {


    useEffect(() => {
        props.getOrderView(defaultParams);
        props.getCustomerReport({ code: '', from_date: '', to_date: '', id: '', status: 1 });
    }, []);

    const customerReport = props.customerReportList || [];

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
            classes: 'text-center',
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "code",
            text: "Customer Code",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "name",
            text: "Customer Name",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "mobile",
            text: "Mobile No.",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "email",
            text: "Email Id",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "company_name",
            text: "Company Name",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "gst_in",
            text: "GST Tin",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            formatter: (cell, row, index) => {
                return (row.status === 1 ? <Badge className="p-2 m-1 badge badge-success">Active</Badge> : (row.status === 2 ? <Badge className="p-2 m-1 badge badge-dark">In Active</Badge> : (row.status === 3 ? <Badge className="p-2 m-1 badge badge-danger">Delete</Badge> : (row.status === 4 ? <Badge className="p-2 m-1 badge badge-warning">In Progress</Badge> : (row.status === 5 ? <Badge className="p-2 m-1 badge badge-danger">Rejected</Badge> : (row.status === 6 ? <Badge className="p-2 m-1 badge badge-light">Hold</Badge> : ''))))));
            },
            dataField: "company_status",
            text: "Company Status",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            formatter: (cell, row, index) => {
                return (row.status === 1 ? <Badge className="p-2 m-1 badge badge-success">Active</Badge> : (row.status === 2 ? <Badge className="p-2 m-1 badge badge-dark">In Active</Badge> : (row.status === 3 ? <Badge className="p-2 m-1 badge badge-danger">Delete</Badge> : (row.status === 4 ? <Badge className="p-2 m-1 badge badge-warning">In Progress</Badge> : (row.status === 5 ? <Badge className="p-2 m-1 badge badge-danger">Rejected</Badge> : (row.status === 6 ? <Badge className="p-2 m-1 badge badge-light">Hold</Badge> : ''))))));
            },
            dataField: "status",
            text: "Status",
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
        totalSize: customerReport.length
    };

    const handleSubmit = (submitData) => {
        console.log('submitData', submitData);
        props.getCustomerReport(submitData);
    }

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Reports", path: rootPath + "report/customer-list" },
                    { name: "Customer List" }
                ]}
            />

            <SimpleCard>
                <Formik
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                    initialValues={{
                        "code": "",
                        "from_date": "",
                        "to_date": "",
                        "id": '', 
                        "status": 1
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
                                                <FormLabel className="font-weight-bold">Mobile Number/Membership Code </FormLabel>
                                                <FormControl
                                                    type="text"
                                                    className="form-control col-md-12"
                                                    name='code'
                                                    placeholder="Mobile Number/Membership Code"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        setFieldValue('code', e.target.value);
                                                    }}
                                                    value={values.code}
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-3">
                                                <FormLabel className="font-weight-bold">From Date</FormLabel>
                                                <FormControl
                                                    name="from_date"
                                                    type="date"
                                                    onChange={(e) => {
                                                        setFieldValue('from_date', e.target.value);
                                                    }}
                                                    value={values.from_date}
                                                    className="form-control col-md-12"
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-3">
                                                <FormLabel className="font-weight-bold">To Date</FormLabel>
                                                <FormControl
                                                    name="to_date"
                                                    type="date"
                                                    onChange={(e) => {
                                                        setFieldValue('to_date', e.target.value);
                                                    }}
                                                    value={values.to_date}
                                                    className="form-control col-md-12"
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 mt-3 pt-1">
                                                <Button
                                                    className="w-100"
                                                    variant="outline-danger m-1 text-capitalize"
                                                    type="submit">
                                                    Search
                                                </Button>
                                            </FormGroup>
                                            <FormGroup className="col-md-2 mt-3 pt-1">
                                                <Button
                                                    className="w-100"
                                                    variant="outline-primary m-1 text-capitalize"
                                                    onClick={(e) => resetForm()}>
                                                    Reset
                                                </Button>
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
                    data={customerReport}
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
                                noDataIndication={"Customer List is empty"}
                            />
                        </>
                    )}

                </ToolkitProvider>
                <div class="d-none">
                    <BootstrapTable
                        keyField='_id'
                        data={customerReport}
                        id="customerListTable"
                        columns={sortableColumn} />
                </div>
                <div class="text-right mt-4">
                    <ReactHTMLTableToExcel
                        id="ds"
                        className="download-table-xls-button btn btn-primary"
                        table="customerListTable"
                        filename="customerList"
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
        customerReportList: state.report.customerReportList
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getOrderView: e => dispatch(getOrderView(e)),
        getCustomerReport: (e) => dispatch(getCustomerReport(e))
    };
}

const CustomerList = connect(mapStateToProps, mapDispatchToProps)(MyItemComp)

export default CustomerList;