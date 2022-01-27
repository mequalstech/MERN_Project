import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@gull";
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderView } from "app/redux/actions/OrderActions";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { DropdownMenu, MenuItem } from 'react-bootstrap-dropdown-menu';
import { DropdownButton } from 'react-bootstrap'
import { Route, Link, BrowserRouter, withRouter, useHistory } from "react-router-dom";
import { browserHistory } from 'react-router';
import {
    Modal,
    Form,
    FormLabel,
    FormGroup,
    FormControl,
    Dropdown,
    Button,
    Badge
} from 'react-bootstrap';
import axios from 'axios';
import * as common from "app/services/common";
import { NotificationContainer, NotificationManager } from "react-notifications";
import { array } from "yup";
import './orderStyle.css'

const MyItemComp = (props = {}) => {
    
    const dispatch = useDispatch()
    const history = useHistory();
    useEffect(() => {
        props.getOrderView(defaultParams)
        
    }, [])

    const defaultParams = {
        "member_id": props.match.params.memberId,
        "order_id": props.match.params.orderId
    }

    const [smShow, setSmShow] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [statusSelected, setstatusSelected] = useState('');

    console.log(props.orderView)
    let Props_order_details=props.orderView?.order_details;
 

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
            dataField: "item_name",
            text: "NAME",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "varient_name",
            text: "UNIT",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "quantity",
            text: "QTY",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "item_price",
            text: "RATE",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            dataField: "total_price",
            text: "TOTAL PRICE",
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
        totalSize: Props_order_details?.length
    };

    const statusUpdateFunction=(status,flag)=>{
        if(flag){
                axios
                    .post("http://algrix.in:1430/order/orderstatus", { member_id: props.match.params.memberId, orderid: props.match.params.orderId, order_status: status })
                    .then((res) => {
                        console.log(res)
                        history.push(`/miyami_admin/order/view-order`);
                    })
                    .catch((err) => {
                        NotificationManager.warning(
                            err.message
                        );
                    })
        }
        
    }
    if(!props.orderView){
        return <div>Loading...</div>
    }

    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Order Details" }
                ]}
            />
            <div className="mx-3 mt-3">
                <h3>My Orders / View Order: {props && props.orderView && props.orderView._id || ''}</h3>
                <div className="card px-5 py-3 mt-3">
                    <div className="d-flex justify-content-between">
                        <div className="left">
                            <h5>{props && props.orderView.code || ''}</h5>
                            <div>Date: {props?.orderView?.order_date}</div>
                        </div>
                        <div className="right">
                            <div>Status: {
                            props && props.orderView && props.orderView.order_status && 
                            (props.orderView.order_status == 4) ? "Open" : 
                            (props.orderView.order_status == 7) ? "Completed" : 
                            (props.orderView.order_status == 8) ? "Confirmed" : 
                            (props.orderView.order_status == 9) ? "Canclled by Member" : 
                            (props.orderView.order_status == 10) ? "Cancelled By Admin" : 
                            (props.orderView.order_status == 11) ? "Out Of Stock" : "" 
                            }</div>
                            
                        </div>
                    </div>
                </div>
                <div className="card p-4 mt-4">
                    <h4 className="text-center">Order Details</h4>
                    <div className="mt-3 d-flex">
                        <div className="w50">
                            <b>Customer Reference:</b>
                            <div>-</div>
                        </div>
                        <div className="w50">
                            <b>Created By:</b>
                            <div>{props && props.orderView && props.orderView?.member_name || ''}</div>
                        </div>
                    </div>
                    <div className="mt-3 d-flex">
                        <div className="w50">
                            <b>Delivery method:</b>
                            <div>Self Collection</div>
                        </div>
                        <div className="w50">
                            <b>Contact Number:</b>
                            <div>{props && props.orderView && props.orderView?.contact_no || ''}</div>
                        </div>
                    </div>
                    <b className="my-3">Remarks:</b>

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
                                    headerclassNamees="datatable-header"
                                    noDataIndication={"Order List is empty"}

                                />
                            </>
                        )}

                    </ToolkitProvider>


                    <div className="mt-3">
                        <b>Last Updated:</b>
                        <div>{props && props.orderView.order_history && props.orderView.updatedon || ''}</div>
                    </div>
                </div>
                <div className="my-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <Link to={{
                                pathname: '/miyami_admin/order/view-order/'
                            }}>
                                <button type="button" className="btn btn-primary mb-3" >Back to order list</button>
                            </Link>
                        </div>
                        <div  className="d-flex">
                            <div  className="mr-2">
                                <FormControl
                                    as="select"
                                    name='type'
                                    className="btn btn-primary mb-3 cls-select-sts"
                                    placeholder="Type"
                                    onChange={(e) => {
                                            console.log(e.target.value)
                                            setstatusSelected(e.target.value)
                                            
                                    }}
                                >
                                    <option class="cls-option" value="" hidden>Update Status</option>
                                    <option class="cls-option" value="4">Open</option>
                                    <option class="cls-option" value="7">Completed</option>
                                    <option class="cls-option" value="8">Confirmed</option>
                                    <option class="cls-option" value="9">Canclled by Member</option>
                                    <option class="cls-option" value="10">Cancelled By Admin</option>
                                    <option class="cls-option" value="11">Out Of Stock</option>
                                </FormControl>
                            </div>
                            <div>
                                
                                <button type="button" className="btn btn-danger mb-3" disabled={statusSelected?false:true} onClick={() => statusUpdateFunction(statusSelected,true)}>Save Changes</button>
                                {/* <Modal
                                    size="md"
                                    show={smShow}
                                    onHide={() => setSmShow(false)}
                                    aria-labelledby="example-modal-sizes-title-md"
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title id="example-modal-sizes-title-md">
                                            Confirm Order
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Your order Confirmed.
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button className="btn btn-danger" onClick={() => setSmShow(false)}>Cancel</button>
                                        <button className="btn btn-primary" onClick={() => {
                                            axios
                                                .post("http://algrix.in:1430/order/orderstatus", { member_id: props.match.params.memberId, orderid: props.match.params.orderId, order_status: 8 })
                                                .then((res) => {
                                                    // var data = common.decryptJWT(res.data.token, true)
                                                    history.push(`/miyami_admin/order/view-order`);
                                                })
                                                .catch((err) => {
                                                    NotificationManager.warning(
                                                        err.message
                                                    );
                                                })
                                        }}>Submit</button>
                                    </Modal.Footer>
                                </Modal> */}
                                {/* <Modal
                                    size="md"
                                    show={lgShow}
                                    onHide={() => setLgShow(false)}
                                    aria-labelledby="example-modal-sizes-title-md"
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title id="example-modal-sizes-title-md">
                                            Cancel Order
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Your order Cancelled.
                                    </Modal.Body>
                                    <Modal.Footer>
                                        
                                        <button className="btn btn-danger" onClick={() =>statusUpdateFunction(statusSelected,false) }>Save changes</button>
                                        {/* <button className="btn btn-primary" onClick={() => {
                                            axios
                                                .post("http://algrix.in:1430/order/orderstatus", { member_id: props.match.params.memberId, orderid: props.match.params.orderId, order_status: 10 })
                                                .then((res) => {
                                                    // var data = common.decryptJWT(res.data.token, true)
                                                    history.push(`/miyami_admin/order/view-order`);
                                                })
                                                .catch((err) => {
                                                    NotificationManager.warning(
                                                        err.message
                                                    );
                                                })
                                        }}>Submit</button> 
                                    </Modal.Footer>
                                </Modal> */}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
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

const Orders = connect(mapStateToProps, mapDispatchToProps)(MyItemComp)

export default Orders;