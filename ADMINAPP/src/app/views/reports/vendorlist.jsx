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
            dataField: "item_name",
            text: "Vendor Code",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "quantity",
            text: "Vendor Name",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "item_price",
            text: "Mobile No.",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "total_price",
            text: "Email Id",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "total_price",
            text: "Billing Address",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "total_price",
            text: "Shipping Address",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "total_price",
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
        totalSize: props.orderView
    };

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Reports", path: rootPath + "report/vendor-list" },
                    { name: "Vendor List" }
                ]}
            />
            <SimpleCard>
                <Form className="needs-validation">
                    <div className="row">
                        <div className="col-md-12 mt-3 d-flex align-items-center">
                            <Form.Row className="col-md-12 p-0">
                                <FormGroup className="col-md-3">
                                    <FormLabel className="font-weight-bold">Vendor Type</FormLabel>
                                    <MultiSelect
                                        options={options}
                                        selected={selected}
                                        onChange={setSelected}
                                        labelledBy={"Select"}
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-3">
                                    <FormLabel className="font-weight-bold">Vendor Name</FormLabel>
                                    <MultiSelect
                                        options={options}
                                        selected={selected}
                                        onChange={setSelected}
                                        labelledBy={"Select"}
                                    />
                                </FormGroup>
                                <FormGroup className="col-md-3 mt-3 d-flex align-items-center justify-content-center">
                                    <Button className="w-100" variant="outline-danger m-1 text-capitalize">Search</Button>
                                    <Button className="w-100" variant="outline-primary m-1 text-capitalize">Reset</Button>
                                </FormGroup>
                            </Form.Row>
                        </div>
                    </div>
                </Form>
            </SimpleCard>

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
                                noDataIndication={"Vendor List is empty"}
                            />
                        </>
                    )}
                </ToolkitProvider>
                <div class="text-right">
                    <button type="button" class="btn btn-primary mr-3 mb-3">Export Excel</button>
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

const VendorList = connect(mapStateToProps, mapDispatchToProps)(MyItemComp)

export default VendorList;