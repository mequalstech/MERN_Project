import React, { useState } from 'react';
import { Breadcrumb } from "@gull";
import { Modal, Form, Button, Badge, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";
import TableRow from './TableRow';

var tableRowIndex = 0;


function AddVendor() {
    const [talbeRows, setRows] = useState([{
        index: 0
    }
    ]);


    const options = [
        { label: "Grapes 🍇", value: "grapes" },
        { label: "Mango 🥭", value: "mango" },
        { label: "Strawberry 🍓", value: "strawberry" }
    ];

    const [selected, setSelected] = useState([]);

    // Receive data from TableRow 
    let handleChange = data => {
        talbeRows[data.index] = data
    }

    // Add New Table Row
    var addNewRow = () => {
        console.log("\n\n\n\n\n CAlled @!#")
        tableRowIndex = parseFloat(tableRowIndex) + 1
        var updatedRows = [...talbeRows]
        updatedRows[tableRowIndex] = { index: tableRowIndex }
        setRows(updatedRows)
    }

    // Remove Table row if rows are count is more than 1
    let deleteRow = (index) => {
        if (talbeRows.length > 1) {
            var updatedRows = [...talbeRows]
            var indexToRemove = updatedRows.findIndex(x => x.index == index);
            if (indexToRemove > -1) {
                updatedRows.splice(indexToRemove, 1)
                setRows(updatedRows);
            }
        }
    }

    return (

        <div className="customers">
            <Breadcrumb
                routeSegments={[
                    { name: "Vendor Add", path: "/inventory/add-vendor" },
                    { name: "Vendor" }
                ]}
            />

            <Form className="mb-5 needs-validation">
                <div className="row">
                    <div className="col-md-6">
                        <Form.Row className="col-md-12 p-0">
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Invoice No</FormLabel>
                                <FormControl
                                    type="text"
                                    className="form-control col-md-12"
                                />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Invoice Date</FormLabel>
                                <FormControl
                                    type="date"
                                    className="form-control col-md-12"
                                />
                            </FormGroup>
                        </Form.Row>
                        <Form.Row className="col-md-12 p-0">
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Vendor</FormLabel>
                                <MultiSelect
                                    options={options}
                                    selected={selected}
                                    onChange={setSelected}
                                    labelledBy={"Select"}
                                />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Vendor Address</FormLabel>
                                <FormControl
                                    type="text"
                                    className="form-control col-md-12"
                                />
                            </FormGroup>
                        </Form.Row>
                    </div>
                    <div className="col-md-6">
                        <Form.Row className="col-md-12 p-0">
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Invoice No</FormLabel>
                                <FormControl
                                    type="text"
                                    className="form-control col-md-12"
                                />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Invoice Date</FormLabel>
                                <FormControl
                                    type="date"
                                    className="form-control col-md-12"
                                />
                            </FormGroup>
                        </Form.Row>
                        <Form.Row className="col-md-12 p-0">
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Received Date</FormLabel>
                                <FormControl
                                    type="date"
                                    className="form-control col-md-12"
                                />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <FormLabel className="font-weight-bold">Remark</FormLabel>
                                <FormControl
                                    type="text"
                                    className="form-control col-md-12"
                                />
                            </FormGroup>
                        </Form.Row>
                    </div>
                </div>
            </Form>


            <table className="table" id="customers">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">PRODUCT</th>
                        <th scope="col">VARIENT</th>
                        <th scope="col">QTY</th>
                        <th scope="col">RATE</th>
                        <th scope="col">TOTAL</th>
                        <th scope="col">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        talbeRows.map((row, index) => {
                            if (row)
                                return (
                                    <TableRow addNew={addNewRow} removeRow={deleteRow} key={index} row={row} handleDataChange={handleChange} deleteRow={deleteRow}></TableRow>
                                )
                        })
                    }
                </tbody>
            </table>
            {/* <div>
                <button className="btn-add" onClick={addNewRow}>+Add</button>
            </div> */}
        </div>
    );
}

export default AddVendor;