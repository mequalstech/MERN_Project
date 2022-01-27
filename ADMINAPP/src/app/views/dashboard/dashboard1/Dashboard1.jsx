import React, { Component } from "react";
import ComparisonChart from "app/views/charts/echarts/ComparisonChart";
import PieChart from "app/views/charts/echarts/PieChart";
import LineChart3 from "app/views/charts/echarts/LineChart3";
import LineChart1 from "app/views/charts/echarts/LineChart1";
import LineChart2 from "app/views/charts/echarts/LineChart2";
import { Breadcrumb } from "@gull";
import SimpleCard from "@gull/components/cards/SimpleCard";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as common from "app/services/common";
import axios from 'axios';

class Dashboard1 extends Component {
    state = {
        cardList1: [],
        cardList2: [],
        topSellingProduct: [
            {
                title: "Wireless Headphone E23",
                description: "Lorem ipsum dolor sit amet consectetur.",
                prevPrice: 500,
                currentPrice: 450,
                imgUrl: "/assets/images/products/headphone-4.jpg"
            },
            {
                title: "Wireless Headphone Y902",
                description: "Lorem ipsum dolor sit amet consectetur.",
                prevPrice: 500,
                currentPrice: 200,
                imgUrl: "/assets/images/products/headphone-3.jpg"
            },
            {
                title: "Wireless Headphone E09",
                description: "Lorem ipsum dolor sit amet consectetur.",
                prevPrice: 500,
                currentPrice: 600,
                imgUrl: "/assets/images/products/headphone-2.jpg"
            },
            {
                title: "Wireless Headphone X89",
                description: "Lorem ipsum dolor sit amet consectetur.",
                prevPrice: 500,
                currentPrice: 350,
                imgUrl: "/assets/images/products/headphone-4.jpg"
            }
        ],
        newUserList: [
            {
                name: "Smith Doe",
                email: "Smith@gmail.com",
                status: "active",
                photoUrl: "/assets/images/faces/1.jpg"
            },
            {
                name: "Jhon Doe",
                email: "Jhon@gmail.com",
                status: "pending",
                photoUrl: "/assets/images/faces/2.jpg"
            },
            {
                name: "Alex",
                email: "Otttio@gmail.com",
                status: "inactive",
                photoUrl: "/assets/images/faces/3.jpg"
            },
            {
                name: "Mathew Doe",
                email: "matheo@gmail.com",
                status: "active",
                photoUrl: "/assets/images/faces/4.jpg"
            }
        ],

        newUserList1: [
            {
                name: "Alex",
                email: "Otttio@gmail.com",
                status: "inactive",
                photoUrl: "/assets/images/faces/3.jpg"
            },
            {
                name: "Alex",
                email: "Otttio@gmail.com",
                status: "inactive",
                photoUrl: "/assets/images/faces/3.jpg"
            },
            {
                name: "Alex",
                email: "Otttio@gmail.com",
                status: "inactive",
                photoUrl: "/assets/images/faces/3.jpg"
            },
            {
                name: "Alex",
                email: "Otttio@gmail.com",
                status: "inactive",
                photoUrl: "/assets/images/faces/3.jpg"
            },
        ],
        userActivity: [
            {
                activitylist: [
                    {
                        title: "Pages / Visit",
                        count: 2065
                    },
                    {
                        title: "New user",
                        count: 465
                    },
                    {
                        title: "Last week",
                        count: 23456
                    }
                ]
            },
            {
                activitylist: [
                    {
                        title: "Pages / Visit",
                        count: 435
                    },
                    {
                        title: "New user",
                        count: 5435643
                    },
                    {
                        title: "Last week",
                        count: 45435
                    }
                ]
            },
            {
                activitylist: [
                    {
                        title: "Pages / Visit",
                        count: 545
                    },
                    {
                        title: "New user",
                        count: 54353
                    },
                    {
                        title: "Last week",
                        count: 4643
                    }
                ]
            }
        ],
        orderList: [],
        EnquiryList: [],
        resentOrderResponce: [],
        resentEnquiryResponce: [],
        resentCancelledOrder: []
    };


    getUserStatusClass = status => {
        switch (status) {
            case "active":
                return "badge-success";
            case "inactive":
                return "badge-warning";
            case "pending":
                return "badge-primary";
            default:
                break;
        }
    };
    /***
       *    Desc : Get table data on load
       */
    componentDidMount() {

        // algrix.in:1430/dashboard
        axios.post('http://algrix.in:1430/dashboard',)
            .then((res) => {
                var data = common.decryptJWT(res.data.token)
                
                let list1 = [
                    {
                        icon: "i-Add-User",
                        title: res.data.data.order_count,
                        subtitle: "total Order"
                    },
                    {
                        icon: "i-Financial",
                        title: res.data.data.member_count,
                        subtitle: "total members"
                    },
                    {
                        icon: "i-Checkout-Basket",
                        title: res.data.data.enquiry_count,
                        subtitle: "total enquiry"
                    },
                    {
                        icon: "i-Money-2",
                        title: res.data.data.out_of_stock_count,
                        subtitle: "out of stock"
                    }
                ]
                this.setState({ cardList1: list1 })
                axios
                    .post("http://algrix.in:1430/order/order_count", { "member_id": "60d2eb2b14f57d6346c688ff" })
                    .then((res) => {
                       
                        let list2 = [
                            {
                                icon: "i-Add-User",
                                title: res.data.data.open_count,
                                subtitle: "Today Open Order"
                            },
                            {
                                icon: "i-Financial",
                                title: res.data.data.confirmation_count,
                                subtitle: "Today Confirmed Order"
                            },
                            {
                                icon: "i-Checkout-Basket",
                                title: res.data.data.complete_count,
                                subtitle: "Today Completed Order"
                            },
                            {
                                icon: "i-Money-2",
                                title: res.data.data.cancel_count,
                                subtitle: "Today Cancelled Order"
                            }
                        ]

                        this.setState({ cardList2: list2 })
                    })
                // let list2 =[
                //     {
                //         icon: "i-Add-User",
                //         title: res.data.data.open_count,
                //         subtitle: "Today Open Order"
                //     },
                //     {
                //         icon: "i-Financial",
                //         title: res.data.data.confirmation_count,
                //         subtitle: "Today Confirmed Order"
                //     },
                //     {
                //         icon: "i-Checkout-Basket",
                //         title: res.data.data.complete_count,
                //         subtitle: "Today Completed Order"
                //     },
                //     {
                //         icon: "i-Money-2",
                //         title: res.data.data.cancel_count,
                //         subtitle: "Today Cancelled Order"
                //     }
                // ]
                // this.setState({cardList2 :list2 })

                let resentCancelledOrderData = []
                res.data.data.CancelOrderdata.forEach(element => {
                    
                    let dateFormates = new Date(element.createdon);
                    let data = {
                        code: element.code,
                        contactNo: element.contact_no,
                        finalPrice: element.final_price,
                        createdBy: element.createdby,
                        createdOn: (dateFormates.getMonth() + 1) + '-' + dateFormates.getDate() + '-' + dateFormates.getFullYear()
                    }
                    resentCancelledOrderData.push(element)
                });
                this.setState({ resentCancelledOrder: resentCancelledOrderData })
                
            })
            .catch((err) => {
                console.log(err)
            })

        axios
            .post("http://algrix.in:1430/order/list_order_all",)
            .then(res => {
                var data = common.decryptJWT(res.data.token)
                this.state.resentOrderResponce = data.orderData1;
                this.state.resentOrderResponce.map((user, index) => {
                    let list = { code: user.code, member_name: user.member_name, final_qty: user.final_qty, final_price: user.final_price, View: "" }
                    this.state.orderList.push(list)
                    this.setState({ resentOrderResponce: this.state.orderList });
                })
            })
            .catch((e) => {
                console.log(e.message);
            });


        axios.post('http://algrix.in:1430/order/list_enquiry_all',)
            .then((res) => {
                var data = common.decryptJWT(res.data.token)
                this.state.resentEnquiryResponce = data.enquiryData1;
                this.state.resentEnquiryResponce.map((user, index) => {

                    let dateFormates = new Date(user.enquiry_date);
                    let date = (dateFormates.getMonth() + 1) + '-' + dateFormates.getDate() + '-' + dateFormates.getFullYear()
                    let list = { EnqNo: user.member_id, Customer: user.member_name, qty: user.final_qty, code: user.code, enq_date: date }
                    this.state.EnquiryList.push(list)
                    this.setState({ resentEnquiryResponce: this.state.EnquiryList });
                })
                console.log(data)
            })
            .catch((err) => {
                console.log(err)
            })

    }
    render() {
        let {
            cardList1 = [],
            cardList2 = [],
            topSellingProduct = [],
            newUserList = [],
            newUserList1 = [],
            userActivity = [],
            resentOrderResponce = [],
            resentEnquiryResponce = [],
            resentCancelledOrder = []
        } = this.state;

        return (
            <div>
                {/* {localStorage.getItem('jwt_token')} */}
                <Breadcrumb
                    routeSegments={[
                        { name: "Dashboard", path: "/dashboard" },
                    ]}
                ></Breadcrumb>
                <div className="row">
                    {cardList1.map((card, index) => (
                        <div key={index} className="col-lg-3 col-md-6 col-sm-6">
                            <div className="card card-icon-bg card-icon-bg-primary w-100 o-hidden mb-4">
                                <div className="card-body text-center">
                                    <i className={card.icon}></i>
                                    <div className="content">
                                        <p className="text-muted mb-2 text-capitalize">
                                            {card.subtitle}
                                        </p>
                                        <p className="lead text-primary text-24 mb-2 text-capitalize">
                                            {card.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                <h3>Order</h3>

                <div className="row">
                    {cardList2.map((card, index) => (
                        <div key={index} className="col-lg-3 col-md-6 col-sm-6">
                            <div className="card card-icon-bg card-icon-bg-primary w-100 o-hidden mb-4">
                                <div className="card-body text-center">
                                    <i className={card.icon}></i>
                                    <div className="content">
                                        <p className="text-muted mb-2 text-capitalize">
                                            {card.subtitle}
                                        </p>
                                        <p className="lead text-primary text-24 mb-2 text-capitalize">
                                            {card.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                <div className="row">
                    <div className="col-md-6">
                        <div className="card mb-4">
                            <div className="card-header card-title mb-0 d-flex align-items-center justify-content-between border-0">
                                <h3 className="w-50 float-left card-title m-0">
                                    Recent Order
                                </h3>
                            </div>
                            <div className="">
                                <div className="table-responsive">
                                    <table id="user_table" className="table  text-center">
                                        <thead>
                                            <tr>
                                                <th scope="col">S.No</th>
                                                <th scope="col">Order No.</th>
                                                <th scope="col">Customer</th>
                                                <th scope="col">Qty</th>
                                                <th scope="col">Amount</th>
                                                {/* <th scope="col">View</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resentOrderResponce.map((user, index) => (
                                                index <= 4 ? (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{user.code}</td>
                                                        <td>{user.member_name}</td>
                                                        <td>{user.final_qty}</td>
                                                        <td>{user.final_price}</td>
                                                        {/* <td>
                                                        <span className="cursor-pointer text-success mr-2">
                                                            <i className="nav-icon i-Pen-2 font-weight-bold"></i>
                                                        </span>
                                                        <span className="cursor-pointer text-danger mr-2">
                                                            <i className="nav-icon i-Close-Window font-weight-bold"></i>
                                                        </span>
                                                    </td> */}
                                                    </tr>
                                                ) : ''
                                            ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card mb-4">
                            <div className="card-header card-title mb-0 d-flex align-items-center justify-content-between border-0">
                                <h3 className="w-50 float-left card-title m-0">
                                    Recent Enquiry
                                </h3>
                            </div>
                            <div className="">
                                <div className="table-responsive">
                                    <table id="user_table" className="table  text-center">
                                        <thead>
                                            <tr>
                                                <th scope="col">S.No</th>
                                                <th scope="col">Code</th>
                                                <th scope="col">Enquiry Date</th>
                                                <th scope="col">Customer</th>
                                                <th scope="col">Qty</th>
                                                {/* <th scope="col">View</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resentEnquiryResponce.map((user, index) => (
                                                index <= 4 ? (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{user.code}</td>
                                                        <td>{user.enq_date}</td>
                                                        <td>{user.Customer}</td>
                                                        <td>{user.qty}</td>
                                                        {/* <td>
                                                        <span className="cursor-pointer text-success mr-2">
                                                            <i className="nav-icon i-Pen-2 font-weight-bold"></i>
                                                        </span>
                                                        <span className="cursor-pointer text-danger mr-2">
                                                            <i className="nav-icon i-Close-Window font-weight-bold"></i>
                                                        </span>
                                                    </td> */}
                                                    </tr>
                                                ) : ''
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* <div className="col-md-6">
                        <div className="card mb-4">
                            <div className="card-header card-title mb-0 d-flex align-items-center justify-content-between border-0">
                                <h3 className="w-50 float-left card-title m-0">
                                    Stock arrived enquiry
                                </h3>
                            </div>
                            <div className="">
                                <div className="table-responsive">
                                    <table id="user_table" className="table  text-center">
                                        <thead>
                                            <tr>
                                                <th scope="col">S.No</th>
                                                <th scope="col">Enquiry No.</th>
                                                <th scope="col">Item</th>
                                                <th scope="col">Varient</th>
                                                <th scope="col">Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newUserList1.map((user, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{user.name}</td>
                                                    <td>
                                                        <img
                                                            onError={common.addDefaultSrc}
                                                            className="rounded-circle m-0 avatar-sm-table "
                                                            src={user.photoUrl}
                                                            alt=""
                                                        />
                                                    </td>

                                                    <td>{user.email}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${this.getUserStatusClass(
                                                                user.status
                                                            )}`}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="col-md-6">
                        <div className="card mb-4">
                            <div className="card-header card-title mb-0 d-flex align-items-center justify-content-between border-0">
                                <h3 className="w-50 float-left card-title m-0">
                                    Recently Cancelled Order
                                </h3>
                            </div>
                            <div className="">
                                <div className="table-responsive">
                                    <table id="user_table" className="table  text-center">
                                        <thead>
                                            <tr>
                                                {/* <th scope="col">S.No</th>
                                                <th scope="col">code</th>
                                                <th scope="col">contact No</th>
                                                <th scope="col">final Price</th> */}
                                                {/* <th scope="col">createdBy</th> */}
                                                {/* <th scope="col">created On</th> */}
                                                {/* <th scope="col">View</th> */}
                                                <th scope="col">S.No</th>
                                                <th scope="col">Order No.</th>
                                                <th scope="col">Customer</th>
                                                <th scope="col">Qty</th>
                                                <th scope="col">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resentCancelledOrder.map((user, index) => (
                                                index <= 4 ? (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{user.code}</td>
                                                        <td>{user.member_name}</td>
                                                        <td>{user.order_details && user.order_details.length || 0}</td>
                                                        <td>{user.final_price}</td>
                                                        {/* <th scope="row">{index + 1}</th>
                                                        <td>{user.code}</td>
                                                        <td>{user.contactNo}</td>
                                                        <td>{user.finalPrice}</td> */}
                                                        {/* <td>{user.createdBy}</td> */}
                                                        {/* <td>{user.createdOn}</td> */}
                                                        {/* <td>
                                                            <img
                                                                onError={common.addDefaultSrc}
                                                                className="rounded-circle m-0 avatar-sm-table "
                                                                src={user.photoUrl}
                                                                alt=""
                                                            />
                                                        </td> */}
                                                        {/* <td>
                                                            <span
                                                                className={`badge ${this.getUserStatusClass(
                                                                    user.status
                                                                )}`}
                                                            >
                                                                {user.status}
                                                            </span>
                                                        </td> */}
                                                        {/* <td>
                                                            <span className="cursor-pointer text-success mr-2">
                                                                <i className="nav-icon i-Pen-2 font-weight-bold"></i>
                                                            </span>
                                                            <span className="cursor-pointer text-danger mr-2">
                                                                <i className="nav-icon i-Close-Window font-weight-bold"></i>
                                                            </span>
                                                        </td> */}
                                                    </tr>
                                                ) : ''
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* <div className="row">
                    <div className="col-lg-8 col-md-12">
                        <SimpleCard title="This Year Sales" className="mb-4">
                            <ComparisonChart height="260px"></ComparisonChart>
                        </SimpleCard>
                    </div>
                    <div className="col-lg-4 col-sm-12">
                        <SimpleCard title="Sales by Countries" className="mb-4">
                            <PieChart height="260px"></PieChart>
                        </SimpleCard>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <div className="row">
                            <div className="col-lg-6 col-md-12">
                                <div className="card mb-4">
                                    <div className="card-title card-body mb-0 pb-0">
                                        <h3 className="mb-4">Last Month Sales</h3>
                                        <p className="text-primary mb-0 text-24">$40250</p>
                                    </div>
                                    <LineChart1 height="260px"></LineChart1>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-12">
                                <div className="card mb-4">
                                    <div className="card-title card-body mb-0 pb-0">
                                        <h3 className="mb-4">Last Week Sales</h3>
                                        <p className="text-primary mb-0 text-24">$10250</p>
                                    </div>
                                    <LineChart2 height="260px"></LineChart2>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card mb-4">
                                    <div className="card-header card-title mb-0 d-flex align-items-center justify-content-between border-0">
                                        <h3 className="w-50 float-left card-title m-0">
                                            New Users
                                        </h3>
                                        <Dropdown alignRight>
                                            <Dropdown.Toggle
                                                as="span"
                                                className="toggle-hidden cursor-pointer"
                                            >
                                                <i className="nav-icon i-Gear-2"></i>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item>Add new user</Dropdown.Item>
                                                <Dropdown.Item>View All users</Dropdown.Item>
                                                <Dropdown.Item>Something else here</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>

                                    <div className="">
                                        <div className="table-responsive">
                                            <table id="user_table" className="table  text-center">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Avatar</th>
                                                        <th scope="col">Email</th>
                                                        <th scope="col">Status</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {newUserList.map((user, index) => (
                                                        <tr key={index}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{user.name}</td>
                                                            <td>
                                                                <img
                                                                    onError={common.addDefaultSrc}
                                                                    className="rounded-circle m-0 avatar-sm-table "
                                                                    src={user.photoUrl}
                                                                    alt=""
                                                                />
                                                            </td>

                                                            <td>{user.email}</td>
                                                            <td>
                                                                <span
                                                                    className={`badge ${this.getUserStatusClass(
                                                                        user.status
                                                                    )}`}
                                                                >
                                                                    {user.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="cursor-pointer text-success mr-2">
                                                                    <i className="nav-icon i-Pen-2 font-weight-bold"></i>
                                                                </span>
                                                                <span className="cursor-pointer text-danger mr-2">
                                                                    <i className="nav-icon i-Close-Window font-weight-bold"></i>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <SimpleCard title="Top selling products" className="mb-4">
                            {topSellingProduct.map((item, index) => (
                                <div
                                    key={index}
                                    className="d-flex flex-column flex-sm-row align-items-sm-center mb-3"
                                >
                                    <img
                                        className="avatar-lg mb-3 mb-sm-0 rounded mr-sm-3"
                                        src={item.imgUrl}
                                        alt=""
                                        onError={common.addDefaultSrc}
                                    />
                                    <div className="flex-grow-1">
                                        <h5 className="">
                                            <Link to="/">{item.title}</Link>
                                        </h5>
                                        <p className="m-0 text-small text-muted">
                                            {item.description}
                                        </p>
                                        <p className="text-small text-danger m-0">
                                            ${item.currentPrice}
                                            <del className="text-muted">${item.prevPrice}</del>
                                        </p>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline-primary mt-3 mb-3 m-sm-0 btn-rounded btn-sm">
                                            View details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </SimpleCard>

                        <div className="card mb-4">
                            <div className="card-body p-0">
                                <div className="card-title border-bottom d-flex align-items-center m-0 p-3">
                                    <h3 className="mb-0">User activity</h3>
                                    <span className="flex-grow-1"></span>
                                    <span className="badge badge-pill badge-warning">
                                        Updated daily
                                    </span>
                                </div>
                                {userActivity.map(({ activitylist = [] }, index) => (
                                    <div
                                        key={index}
                                        className="d-flex border-bottom justify-content-between p-3"
                                    >
                                        {activitylist.map((item, i) => (
                                            <div key={i} className="flex-grow-1">
                                                <span className="text-small text-muted">
                                                    {item.title}
                                                </span>
                                                <h5 className="m-0">{item.count}</h5>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="card mb-4">
                            <div className="card-body card-title mb-0">
                                <h3 className="m-0">Last 20 Day Leads</h3>
                            </div>
                            <LineChart3 height="360px"></LineChart3>
                        </div>
                    </div>
                </div> */}
            </div>
        );
    }
}

export default Dashboard1;
