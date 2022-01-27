import React, { useEffect, useState } from "react";
import { Breadcrumb, SimpleCard } from "@gull";
import { connect } from 'react-redux';
import { getOrderView } from "app/redux/actions/OrderActions";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Form, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";
import { rootPath } from 'app/config';

const MyItemComp = (props) => {

    const [flag, setFlag] = useState(false);

    useEffect(() => {
        props.getOrderView(defaultParams)
    }, [])

    const defaultParams = {
        "member_id": props.match.params.memberId,
        "order_id": props.match.params.orderId
    }

    const options = [
        { label: "Grapes 🍇", value: "grapes" },
        { label: "Mango 🥭", value: "mango" },
        { label: "Strawberry 🍓", value: "strawberry" }
    ];

    const [selected, setSelected] = useState([]);

    const handleChange = e => {
        console.log("S.No", e.target.value);
        setFlag(
            e.target.value === 'red' ? true : false
        )
    };


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
            dataField: "item_name",
            text: "Enquiry No.",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "varient_name",
            text: "Enquiry Date",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "quantity",
            text: "Shop Name",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "item_price",
            text: "Customer",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "ite",
            text: "Qty",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "item1",
            text: "Amount",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "item1",
            text: "Order Status",
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
        totalSize: props.orderView
    };

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Reports", path: rootPath + "report/enquiry-register" },
                    { name: "Enquiry Register" }
                ]}
            />
            <SimpleCard>
                <div className="row align-items-center justify-content-center">
                    <div className="mr-2">
                        <input type="radio" name="action" defaultChecked value="green" onChange={handleChange} /> Summary
                    </div>
                    <div className="ml-2">
                        <input type="radio" name="action" value="red" onChange={handleChange} /> Details
                    </div>
                </div>

                <Form className="needs-validation mt-4">
                    <div className="row">
                        <div className="col-md-12">
                            <Form.Row className="col-md-12 p-0">
                                <FormGroup className="col-md-3">
                                    <FormLabel className="font-weight-bold">From Date</FormLabel>
                                    <FormControl
                                        type="date"
                                        className="form-control col-md-12"
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-3">
                                    <FormLabel className="font-weight-bold">To Date</FormLabel>
                                    <FormControl
                                        type="date"
                                        className="form-control col-md-12"
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-3">
                                    <FormLabel className="font-weight-bold">Customer</FormLabel>
                                    <MultiSelect
                                        options={options}
                                        selected={selected}
                                        onChange={setSelected}
                                        labelledBy={"Select"}
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-3">
                                    <FormLabel className="font-weight-bold">Product</FormLabel>
                                    <MultiSelect
                                        options={options}
                                        selected={selected}
                                        onChange={setSelected}
                                        labelledBy={"Select"}
                                    />
                                </FormGroup>
                            </Form.Row>
                        </div>
                        <div className="col-md-12 mt-3">
                            <Form.Row className="col-md-12 p-0 d-flex align-items-center">
                                <FormGroup className="col-md-3">
                                    <FormLabel className="font-weight-bold">Enquiry No.</FormLabel>
                                    <FormControl
                                        type="text"
                                        disabled={true}
                                        className="form-control col-md-12"
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-3 mt-3 ml-0 d-flex align-items-center justify-content-start">
                                    <Button className="w-100" variant="outline-danger m-1 text-capitalize">Search</Button>
                                    <Button className="w-100" variant="outline-primary m-1 text-capitalize">Reset</Button>
                                </FormGroup>
                            </Form.Row>

                        </div>
                    </div>
                </Form>
            </SimpleCard>

            {flag === false ?
                <SimpleCard className='mt-4'>
                    <ToolkitProvider
                        striped
                        keyField='_id'
                        data={props?.orderView?.order_details || []}
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
                                    noDataIndication={"Enquiry List is empty"}
                                />
                            </>
                        )}
                    </ToolkitProvider>
                    <div className="text-right">
                        <button type="button" className="btn btn-primary">Download Excel</button>
                    </div>
                </SimpleCard>
                :
                <SimpleCard className='mt-4'>
                    <table className="customTable">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Enquiry No.</th>
                                <th>Enquiry Date</th>
                                <th>Shop Name</th>
                                <th>Customer</th>
                                <th>Product Name</th>
                                <th>Product Code</th>
                                <th>Variant</th>
                                <th>Pack</th>
                                <th>Qty</th>
                                <th>Amount</th>
                                <th>Order Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>A</td>
                                <td>B</td>
                                <td>C</td>
                                <td>100</td>
                                <td>100</td>
                                <td>100</td>
                                <td>A</td>
                                <td>B</td>
                                <td>C</td>
                                <td>100</td>
                                <td>100</td>
                                <td>100</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="9"></td>
                                <td>200</td>
                                <td>200</td>
                            </tr>
                        </tfoot>
                    </table>
                    <div className="text-right mt-4">
                        <button type="button" className="btn btn-primary">Download Excel</button>
                    </div>
                </SimpleCard>}

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

const EnquiryRegister = connect(mapStateToProps, mapDispatchToProps)(MyItemComp)

export default EnquiryRegister;