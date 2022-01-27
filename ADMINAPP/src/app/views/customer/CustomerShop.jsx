import React, { useEffect, useState } from "react";
import { Breadcrumb, SimpleCard } from "@gull";
import { Modal,Form, FormLabel,FormGroup,FormControl,Dropdown,Button,Badge } from 'react-bootstrap';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Formik } from "formik";
import { getCustomershop, getCustomerById, shopStatusUpdate } from "app/redux/actions/CustomerActions";
import { NotificationContainer, NotificationManager } from "react-notifications";
import swal from "sweetalert2";
import { connect } from 'react-redux';
import { rootPath } from 'app/config';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const ManageCustomer = (props) => {

    const [customerModal, setCustomerModal] = useState(false);
    const [customerData, setCustomerData] = useState([]);
    // const customerData = props.customerById || [];
    useEffect(() => {
        props.getCustomershop();
    }, []);


    const customershop = props.customershopList || [];

    let sortableColumn = [
        {
            text: "#",
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
            dataField: "email",
            text: "E-Mail",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "mobile",
            text: "Mobile",
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
            dataField: "gst_in_number",
            text: "GST Number",
            sort: false
        },
        {
            text: "Action",
            headerStyle: {
                width: '18%',
                textAlign: 'center',
            },
            formatter: (cell, row, index) => {
                return <>
                    <Button
                        className='m-1 csstooltip'
                        variant='outline-primary'
                        onClick={() => {
                            setCustomerData([row]);
                            setCustomerModal(true);
                        }}>
                        <i className='text-18 ion-ios-eye'></i>
                        <span className="csstooltiptext">View</span>
                    </Button>
                   {(row.shop_status===4 || row.shop_status===6)&&
                    <Button
                        className='m-1 csstooltip'
                        variant='outline-info'
                        onClick={() => {
                            swal
                                .fire({
                                    title: "Are you sure?",
                                    text: "Do you want to verified this customer!",
                                    icon: "warning",
                                    type: "question",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, verified it!",
                                    cancelButtonText: "No"
                                }).then(result => {
                                    if (result.value) {
                                        props.shopStatusUpdate({ memberid: row._id, address_id: row.address_id, status: 1 }, NotificationManager);
                                    }
                                })
                        }}>
                        <i className='text-18 ion-ios-checkmark'></i>
                        <span className="csstooltiptext">Verify</span>
                    </Button>}
                   {(row.shop_status===1||row.shop_status===5)&&
                        <Button
                        className='m-1 csstooltip'
                        variant='outline-info'
                        onClick={() => {
                            swal
                                .fire({
                                    title: "Are you sure?",
                                    text: "Do you want to Hold this customer!",
                                    icon: "warning",
                                    type: "question",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, Hold it!",
                                    cancelButtonText: "No"
                                })
                                .then(result => {
                                    if (result.value) {
                                        props.shopStatusUpdate({ memberid: row._id, address_id: row.address_id, status: 6 }, NotificationManager);
                                    }
                                })
                        }}>
                        <i className='text-18 ion-md-pause'></i>
                        <span className="csstooltiptext">Hold</span>
                    </Button>}
                    <Button
                        className='m-1 btn btn-outline-danger csstooltip'
                        variant='outline-info'
                        onClick={() => {
                            swal.fire({
                                    title: "Are you sure?",
                                    text: "Do you want to Delete this customer!",
                                    icon: "warning",
                                    type: "question",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, Delete it!",
                                    cancelButtonText: "No"
                                })
                                .then(result => {
                                    if (result.value) {
                                        if (result.value) {
                                            props.shopStatusUpdate({ memberid: row._id, address_id: row.address_id, status: 3 }, NotificationManager);
                                        }
                                    }
                                })
                        }}
                    >
                        <i className='text-18 ion-ios-trash'></i>
                        <span className="csstooltiptext">Delete</span>
                    </Button>
                </>;
            },
            style: {
                whiteSpace: 'nowrap',
            },
            classes: 'text-center',
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center'
            },
            formatter: (cell, row, index) => {
                return (row.shop_status === 1 ? <Badge className="p-2 m-1 badge badge-success">Verified </Badge> : 
                (row.shop_status === 2 ? <Badge className="p-2 m-1 badge badge-dark">In Active</Badge> : 
                (row.shop_status === 3 ? <Badge className="p-2 m-1 badge badge-danger">Delete</Badge> : 
                (row.shop_status === 4 ? <Badge className="p-2 m-1 badge badge-warning">In Progress</Badge> :
                 (row.shop_status === 5 ? <Badge className="p-2 m-1 badge badge-danger">Rejected</Badge> :
                  (row.shop_status === 6 ? <Badge className="p-2 m-1 badge badge-light">Hold</Badge>:
                  (row.shop_status === 0 ? <Badge className="p-2 m-1 badge badge-light">Blocked</Badge> : '')))))));
            },
            text: "Shop Status",
            dataField: "shop_status",
            editable: false,
            classes: 'text-center',
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
            text: "Customer Status",
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
        totalSize: customershop.length
    };

    const handleSubmit = (values) => {
        props.getCustomershop(values);
    }


    const MyExportCSV = (props) => {
        const handleClick = () => {
            let customer_export = []
            customershop.forEach((e, i) => {
                customer_export.push({
                    _id: i,
                    name: e.name,
                    email: e.email,
                    mobile: e.mobile,
                    shopname: e.shopname,
                    status: (e.status === 1 ? 'Active' : (e.status === 2 ? 'In Active' : (e.status === 3 ? 'Delete' : (e.status === 4 ? 'In Progress' : (e.status === 5 ? 'Rejected' : (e.status === 6 ? 'Hold' : '')))))),
                })
            });
            props.onExport(customer_export);
        };
        return (
            <div>
                <div className="text-right mb-3">
                    <button className="btn btn-outline-success" onClick={handleClick}>Export to CSV</button>
                </div>
            </div>
        );
    };


    const memberVerifed = (event) => {
        let status = event.target[0].form.shop_status.value && parseInt(event.target[0].form.shop_status.value);
        if (status !== '') {
            props.shopStatusUpdate({ memberid: customerData && customerData[0]._id, address_id: customerData && customerData[0].address_id, status }, NotificationManager);
        }
        else {
            NotificationManager.warning('Please Select Customer Status !!!');
        }

        event.preventDefault();
        setCustomerModal(false);
    }

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Customer", path: rootPath + "customer/customer-shop" },
                    { name: "Customer shop" }
                ]} />

            <SimpleCard>
                <Formik
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                    initialValues={{
                        "code": "",
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
                            </Form>)}}
                </Formik>
            </SimpleCard>

            <SimpleCard className='mt-4' title="Customer Shop">
                <ToolkitProvider
                    striped
                    keyField='_id'
                    data={customershop}
                    columns={sortableColumn}
                    search
                    exportCSV={{
                        fileName: 'customer-details-' + new Date() + '.csv',
                        blobType: 'text/csv;charset=ansi',
                        noAutoBOM: false,
                    }}>
                    {props => (
                        <>
                            <div>
                                <MyExportCSV {...props.csvProps} />
                            </div>
                            <BootstrapTable
                                {...props.baseProps}
                                bootstrap4
                                className="table-responsive"
                                keyField='_id'
                                pagination={paginationFactory(paginationOptions)}
                                headerClasses="datatable-header"
                                noDataIndication={"Customer is empty"}

                            />
                        </>
                    )}

                </ToolkitProvider>
                <div class="d-none">
                    <BootstrapTable
                        keyField='_id'
                        data={customershop}
                        id="customerShopTable"
                        columns={sortableColumn} />
                </div>
                <div class="text-right mt-4">
                    <ReactHTMLTableToExcel
                        id="ds"
                        className="download-table-xls-button btn btn-primary"
                        table="customerShopTable"
                        filename="customerShop"
                        sheet="tablexls"
                        buttonText="Export Excel" />
                </div>
            </SimpleCard>

            <NotificationContainer />
            <Modal show={customerModal} onHide={() => setCustomerModal(false)} backdrop="static" keyboard={false} size="lg">
                <Form method="POST" onSubmit={event => memberVerifed(event)}>
                    <Modal.Header closeButton>
                        <Modal.Title>View Customer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Row>
                            <FormGroup className="col-md-4 mb-3 pl-0">
                                <FormLabel>Customer Name</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    placeholder="Customer Name"
                                    value={(customerData.length > 0) ? customerData[0].name : ''}
                                />
                                <FormControl
                                    type="hidden"
                                    name='_id'
                                    value={(customerData.length > 0) ? customerData[0]._id : ''}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3 pl-0">
                                <FormLabel>E-Mail</FormLabel>
                                <FormControl
                                    type="text"
                                    className="form-control col-md-12"
                                    name='email'
                                    disabled={true}
                                    placeholder="E-Mail"
                                    value={(customerData.length > 0) ? customerData[0].email : ''}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3 pl-0">
                                <FormLabel>Mobile</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    name='mobile'
                                    placeholder="Mobile"
                                    value={(customerData.length > 0) ? customerData[0].mobile : ''}
                                />
                            </FormGroup>
                            {/* <FormGroup className="col-md-4 mb-3 pl-0">
                                <FormLabel>Shop.Name</FormLabel>
                                <FormControl
                                    type="text"
                                    disabled={true}
                                    className="form-control col-md-12"
                                    name='shopname'
                                    placeholder="Shop.Name"
                                    value={(customerData.length > 0) ? customerData[0].shopname : ''}
                                />
                            </FormGroup> */}
                            <FormGroup className="col-md-4 mb-3 pl-0">
                                <FormLabel>Shop Status</FormLabel>
                                <FormControl
                                    as="select"
                                    className="form-control col-md-12"
                                    name='shop_status'
                                    disabled={(customerData.length > 0 && (customerData[0].shop_status === 6 || customerData[0].shop_status === 4 || customerData[0].shop_status === 0 || customerData[0].shop_status === 2)?false : true)}>
                                    <option value="" hidden>Select Status</option>
                                    <option selected={(customerData.length > 0 ? (customerData[0].shop_status === 5 ? true : false) : false)} value="5">Rejected</option>
                                    <option selected={(customerData.length > 0 ? (customerData[0].shop_status === 6 ? true : false) : false)} value="6">Hold</option>
                                    <option selected={(customerData.length > 0 ? (customerData[0].shop_status === 1 ? true : false) : false)} value="1">Verified</option>
                                    <option selected={(customerData.length > 0 ? (customerData[0].shop_status === 0 ? true : false) : false)} value="0">Block</option>
                                    <option selected={(customerData.length > 0 ? (customerData[0].shop_status === 2 ? true : false) : false)} value="2">Inactive</option>

                                </FormControl>
                                <FormControl
                                    type="hidden"
                                    name='customer_id'
                                    value={(customerData.length > 0) ? customerData[0]._id : 0}
                                />
                            </FormGroup>
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="float-right">
                            <Button variant="outline-danger m-1 text-capitalize" onClick={() => setCustomerModal(false)}>Cancel</Button>
                            <Button type="submit" variant="outline-primary m-1 text-capitalize" >Submit</Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}


const mapStateToProps = (state) => {
    return {
        customershopList: state.customer.customershopList,
        customerById: state.customer.customerById
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCustomershop: (e) => dispatch(getCustomershop(e)),
        getCustomerById: (e,s,n) => dispatch(getCustomerById(e,s,n)),
        shopStatusUpdate: (e,s) => dispatch(shopStatusUpdate(e,s))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCustomer);