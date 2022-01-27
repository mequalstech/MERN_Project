import React, { useEffect, useState } from "react";
import { Breadcrumb, SimpleCard } from "@gull";
import { connect } from 'react-redux';
import { getOrderView } from "app/redux/actions/OrderActions";
import { getStockDetailsInventory, getCategoryDropdownValues, getSubCategoryDropdownValues, getProductDropdownValues } from "app/redux/actions/ReportActions";
import { getStockLedgerInventory } from "app/redux/actions/ReportActions";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Formik } from "formik";
import { Form, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";
import { rootPath } from 'app/config';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Loading } from "@gull";
export const datedate = {
    sdate: '',
    edate: '',
    label: ''
}
const MyItemComp = (props) => {

    const [dateValue, setdateValue] = useState('');
    const [tableLoader, setTableLoader] = useState(false);

    useEffect(() => {
        props.getOrderView(defaultParams);
        props.getCategoryDropdownValues();
        props.getSubCategoryDropdownValues();
        props.getProductDropdownValues({ cat_ids: [], sub_ids: [], type: 'product' });
    }, []);

    const handleSubmit = (submitValues) => {
        const submitData = {
            "cat_ids": submitValues.cat_ids && submitValues.cat_ids.map(_ => _.value) || [],
            "sub_ids": submitValues.sub_ids && submitValues.sub_ids.map(_ => _.value) || [],
            "product_ids": submitValues.product_ids && submitValues.product_ids.map(_ => _.value) || [],
            "from_date": submitValues.from_date || "",
            "to_date": submitValues.to_date || ""
        };
        setTableLoader(true);
        props.getStockLedgerInventory(submitData, setTableLoader);

    }

    const stockInventoryLedger = props.stockInventoryLedgerList || [];

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
            dataField: "subcategory",
            text: "Customer / Vendor Name",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "transaction_date",
            text: "Date",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "product_name",
            text: "Product",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "variant_name",
            text: "Variant",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "opening",
            text: "Opening",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "reciept",
            text: "Reciept",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "issue",
            text: "Issue",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "closing",
            text: "Closing",
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
        totalSize: stockInventoryLedger.length
    };

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Reports", path: rootPath + "report/stock-ledgerDetails" },
                    { name: "Stock Ledger Details" }
                ]}
            />

             <SimpleCard>
                <Formik
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                    initialValues={{
                        "cat_ids": [],
                        "sub_ids": [],
                        "product_ids": [],
                        "from_date": "",
                        "to_date": ""
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
                                autoComplete={false}
                            >
                                <div className="row">
                                    <div className="col-md-12">
                                        <Form.Row className="col-md-12 p-0">
                                            <FormGroup className="col-md-4 ">
                                                <FormLabel className="font-weight-bold">Category Name </FormLabel>
                                                <MultiSelect
                                                    options={props.categoryDropdownValues || []}
                                                    value={values.cat_ids}
                                                    onChange={(e) => {
                                                        setFieldValue('cat_ids', e);
                                                        props.getProductDropdownValues({ cat_ids: e.map(_ => _.value) || [], sub_ids: values.sub_ids && values.sub_ids.map(_ => _.value) || [], type: 'product' });
                                                    }}
                                                    onBlur={handleBlur}
                                                    label={"Select category"}
                                                    name="cat_ids"
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-4 ">
                                                <FormLabel className="font-weight-bold">Sub Category Name </FormLabel>
                                                <MultiSelect
                                                    options={props.subcategoryDropdownValues || []}
                                                    value={values.sub_ids}
                                                    onChange={(e) => {
                                                        setFieldValue('sub_ids', e);
                                                        props.getProductDropdownValues({ cat_ids: values.cat_ids && values.cat_ids.map(_ => _.value) || [], sub_ids: e.map(_ => _.value) || [], type: 'product' });
                                                    }}
                                                    onBlur={handleBlur}
                                                    label={"Select sub category"}
                                                    name="sub_ids"
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-4 ">
                                                <FormLabel className="font-weight-bold">product Name </FormLabel>
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
                                            <Form.Group className="col-sm-4">
                                                <FormLabel className="font-weight-bold">Select Date Range</FormLabel>
                                                <DateRangePicker
                                                    label={"Select Date Range"}
                                                    initialSettings={
                                                        {
                                                            startDate: moment().toDate(),
                                                            placeholder: "Select Date Range",
                                                            endDate: moment().endOf('month').toDate(),
                                                            ranges: {
                                                                Today: [moment().toDate(), moment().toDate()],
                                                                Yesterday: [
                                                                    moment().subtract(1, 'days').toDate(),
                                                                    moment().subtract(1, 'days').toDate(),
                                                                ],
                                                                'Last 7 Days': [
                                                                    moment().subtract(6, 'days').toDate(),
                                                                    moment().toDate(),
                                                                ],
                                                                'Last 30 Days': [
                                                                    moment().subtract(29, 'days').toDate(),
                                                                    moment().toDate(),
                                                                ],
                                                                'This Month': [
                                                                    moment().startOf('month').toDate(),
                                                                    moment().endOf('month').toDate(),
                                                                ],
                                                                'Last Month': [
                                                                    moment().subtract(1, 'month').startOf('month').toDate(),
                                                                    moment().subtract(1, 'month').endOf('month').toDate(),
                                                                ],
                                                            },
                                                        }
                                                    }
                                                    onCallback={(s, e) => {
                                                        let dateFormates = new Date(s);
                                                        let dateFormatee = new Date(e);
                                                        
                                                        setFieldValue('from_date', (dateFormates.getFullYear() + '-' + (dateFormates.getMonth() + 1) + '-' + dateFormates.getDate()));
                                                        
                                                        setFieldValue('to_date', (dateFormatee.getFullYear() + '-' + (dateFormatee.getMonth() + 1) + '-' + dateFormatee.getDate()));
                                                        
                                                        datedate.sdate = (dateFormates.getMonth() + 1) + '-' + dateFormates.getDate() + '-' + dateFormates.getFullYear();
                                                        datedate.edate = (dateFormatee.getMonth() + 1) + '-' + dateFormatee.getDate() + '-' + dateFormatee.getFullYear();
                                                        (s.format('D MMMM YYYY') === e.format('D MMMM YYYY')) ? datedate.label = s.format('D MMMM YYYY') : datedate.label = s.format('D MMMM YYYY') + ' - ' + e.format('D MMMM YYYY');
                                                        setdateValue((s.format('D MMMM YYYY') === e.format('D MMMM YYYY')) ? datedate.label = s.format('D MMMM YYYY') : datedate.label = s.format('D MMMM YYYY') + ' - ' + e.format('D MMMM YYYY'))
                                                        setTimeout(() => {
                                                            (s.format('D MMMM YYYY') === e.format('D MMMM YYYY')) ? datedate.label = s.format('D MMMM YYYY') : datedate.label = s.format('D MMMM YYYY') + ' - ' + e.format('D MMMM YYYY');
                                                        }, 1000);
                                                    }}
                                                >
                                                    <button className="form-control text-left ip-btn-cls" placeholder="Select Date Range">{dateValue ? dateValue : 'Select Date Range'}</button>
                                                </DateRangePicker>
                                            </Form.Group>
                                            <FormGroup className="col-md-2 mt-3 pt-1">
                                                <Button className="w-100" variant="outline-danger m-1 text-capitalize" type="submit">Search</Button>
                                            </FormGroup>
                                            <FormGroup className="col-md-2 mt-3 pt-1">
                                                <Button className="w-100" variant="outline-primary m-1 text-capitalize" onClick={(e) => {
                                                    resetForm();
                                                    setdateValue(false);
                                                    }}>Reset</Button>
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


            {tableLoader ? <Loading /> : <SimpleCard className='mt-4'>
                <ToolkitProvider
                    striped
                    keyField='_id'
                    data={stockInventoryLedger || []}
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
                                noDataIndication={"Stock Ledger List is empty"}
                            />
                        </>
                    )}

                </ToolkitProvider>
                <div class="d-none">
                    <BootstrapTable
                        keyField='_id'
                        data={stockInventoryLedger || []}
                        id="stockInventoryLedger"
                        columns={sortableColumn} />
                </div>
                <div class="text-right mt-4">
                    <ReactHTMLTableToExcel
                        id="ds"
                        className="download-table-xls-button btn btn-primary"
                        table="stockInventoryLedger"
                        filename="stockLedger"
                        sheet="tablexls"
                        buttonText="Export Excel" />
                </div>
            </SimpleCard>}
        </>
    )
}

function mapStateToProps(state) {
    return {
        orderView: state.order.orderView,
        stockInventoryLedgerList: state.report.stockInventoryLedgerList,
        categoryDropdownValues: state.report.categoryDropdownValues,
        subcategoryDropdownValues: state.report.subcategoryDropdownValues,
        productDropdownValues: state.report.productDropdownValues
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getOrderView: e => dispatch(getOrderView(e)),
        getStockLedgerInventory: (e, s) => dispatch(getStockLedgerInventory(e, s)),
        getCategoryDropdownValues: e => dispatch(getCategoryDropdownValues(e)),
        getSubCategoryDropdownValues: e => dispatch(getSubCategoryDropdownValues(e)),
        getProductDropdownValues: e => dispatch(getProductDropdownValues(e))
    };
}

const StockLedgerDetails = connect(mapStateToProps, mapDispatchToProps)(MyItemComp)

export default StockLedgerDetails;