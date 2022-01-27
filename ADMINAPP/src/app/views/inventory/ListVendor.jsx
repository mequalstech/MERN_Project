import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Badge, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import BootstrapTable from "react-bootstrap-table-next";
import { Breadcrumb, SimpleCard } from "@gull";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import { rootPath } from 'app/config'
import swal from "sweetalert2";
import { NotificationContainer, NotificationManager } from "react-notifications";
import { connect } from 'react-redux';
import { getVendorList, deleteVendorList, updateVendorList } from '../../redux/actions/InventoryActions';
import { Loading } from "@gull";

const ListVendor = (props) => {

    const [selectedRows, setSelectedRows] = useState([]);
    const [pageLoader,setPageLoader] = useState(false);

    useEffect(() => {
        props.getVendorList(setPageLoader);
    }, []);

    const vendorList = props.vendorList && (props.vendorList || []).map((s, i) => Object.assign({}, s, { sno: i + 1 })) || [];

    if(pageLoader){
        return <Loading />;
    }

    const paginationOptions = {
        custom: false,
        paginationSize: 10,
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
        totalSize: vendorList && vendorList.length || 0
    };
    console.log('paginationOptions', paginationOptions);


    const handleDelete = (row) => {
        swal
            .fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No"
            })
            .then(result => result.isConfirmed ? props.updateVendorList(row && Object.assign({}, row, { status: 3 }) || {}, NotificationManager, setPageLoader) : null)
    }

    const sortableColumn = [
        {
            text: "S.No",
            formatter: (cell, row, index) => <>{index + 1}</>,
            headerStyle: {
                width: '8%',
                textAlign: 'center',
            },
            classes: 'text-center',
            dataField: "sno",
        },
        {

            dataField: "action",
            text: "Action",
            headerStyle: {
                width: '17%',
                textAlign: 'center',
            },
            style: {
                whiteSpace: 'nowrap',
            },
            formatter: (cell, row, index) => {
                return <>
                    <Button
                        className='m-1'
                        variant='outline-primary'
                        onClick={() => {
                            props.vendorEdit(row);
                            props.getVendorList(setPageLoader);
                        }}>
                        <i className='text-18 ion-ios-create'></i>
                    </Button>
                    <Button
                        className='m-1'
                        variant='outline-danger'
                        onClick={() =>handleDelete(row)}>
                        <i className='text-18 ion-ios-trash'></i>
                    </Button>
                </>;
            },
            classes: 'text-center',
            sort: false
        },
        {
            headerStyle: {
                width: '15%',
                textAlign: 'center',
            },
            dataField: "firstname",
            text: "Firstname",
            sort: false
        },
        {
            headerStyle: {
                width: '15%',
                textAlign: 'center',
            },
            dataField: "lastname",
            text: "Lastname",
            sort: false
        },
        {
            headerStyle: {
                textAlign: 'center',
            },
            text: "email",
            dataField: "email",
            sort: false
        },
        {

            dataField: "status",
            headerStyle: {
                width: '10%',
                textAlign: 'center'
            },
            formatter: (cell, row, index) => {
                return (row.status === 1) ? <Badge className="p-2 m-1 badge badge-success">Active</Badge> : <Badge className="p-2 m-1 badge badge-danger">In Active</Badge>;
            },
            text: "Status",
            editable: false,
            classes: 'text-center',
            sort: false
        },
    ];


    const handleOnSelect = (row, isSelect) => {
        if (isSelect)
            selectedRows.push(row);
        else
            selectedRows.pop(row);


        setSelectedRows(selectedRows);
        return true;
    }
    const handleOnSelectAll = (isSelect, rows, row) => {
        setSelectedRows(isSelect ? rows : []);
        return true;
    }

    const action = (type) => {
        let request = {
            ids: selectedRows.map(e => e._id),
            status: type === 'active' ? 1 : (type === 'inactive' ? 2 : 3)
        };

        console.log("request data", request);

        swal
            .fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, " + (type === 'active' ? 'Active' : (type === 'inactive' ? 'In Active' : (type === 'delete' ? 'Delete' : ''))) + " it!",
                cancelButtonText: "No"
            })
            .then(result => result.value ? props.deleteVendorList(request, NotificationManager, setPageLoader) : null)
            .finally(() => setSelectedRows([]))
    }

    let { SearchBar } = Search;

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: false,
        clickToEdit: true,
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll,
        selected: (selectedRows || []).map(_ => _.sno)
    };


    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Inventory", path: rootPath + "inventory/manage-vendor" },
                    { name: "Manage Vendor" }
                ]}
            ></Breadcrumb>
            <SimpleCard title={
                <>Vendor List
                    <div className="float-right">
                        <Button
                            onClick={() => props.vendorAdd('')}
                            variant="outline-success m-1 text-capitalize">
                            Add Vendor
                        </Button>
                    </div>
                </>}>
                <ToolkitProvider
                    striped
                    keyField='sno'
                    data={vendorList}
                    columns={sortableColumn}
                    search>
                    {props => (
                        <>
                            <div className="d-flex justify-content-end mt-2 w-100 pt-3">
                                <span className="mb-2 mr-1 pt-1 mt-1">Search:</span>
                                <SearchBar {...props.searchProps} className="mb-0" />
                            </div>
                            <BootstrapTable
                                {...props.baseProps}
                                bootstrap4
                                className="table-responsive"
                                keyField='sno'
                                selectRow={selectRow}
                                pagination={paginationFactory(paginationOptions)}
                                headerClasses="datatable-header"
                                noDataIndication={"Vendor is empty"}
                            />
                        </>
                    )}
                </ToolkitProvider>
                <div className="card-footer-btn">
                    <Button onClick={() => action('active')} variant="outline-info mr-1">Active</Button>
                    <Button onClick={() => action('inactive')} variant="outline-secondary m-1">In Active</Button>
                    <Button onClick={() => action('delete')} variant="outline-danger m-1">Delete</Button>
                </div>
            </SimpleCard>
            <NotificationContainer />
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        vendorList: state.inventory.vendorList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getVendorList: (e) => dispatch(getVendorList(e)),
        updateVendorList: (e, s, k) => dispatch(updateVendorList(e, s, k)),
        deleteVendorList: (e, s, k) => dispatch(deleteVendorList(e, s, k))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ListVendor);