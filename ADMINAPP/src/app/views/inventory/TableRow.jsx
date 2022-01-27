import React, { useState } from 'react';
import { Breadcrumb } from "@gull";
import { Modal, Form, Button, Badge, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";

function TableRow({ addNew, removeRow, row, handleDataChange, deleteRow }) {
    const index = row.index

    const updateValues = e => {
        var inputName = e.target.name
        var inputValue = e.target.value

        handleDataChange({
            index: index
        })
    }

    function getIndex(index) {
        return index.findIndex(obj => obj.index === index);
    }

    console.log("PRODUCT", index)


    const removeRo = () => {
        deleteRow(index)
        removeRow();
    }

    return (
        <tr>
            <td>{index + 1}</td>
            <td data-label="PRODUCT">
                <FormGroup>
                    <FormControl
                        type="text"
                        className="form-control"
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                        as="textarea"
                        className="form-control"
                    />
                </FormGroup>
            </td>
            <td data-label="VARIENT">
                <FormGroup>
                    <MultiSelect
                        options='partner'
                    />
                </FormGroup>
            </td>
            <td data-label="QTY">
                <FormGroup>
                    <FormControl
                        type="text"
                        className="form-control"
                    />
                </FormGroup>
            </td>
            <td data-label="RATE">
                <FormGroup>
                    <FormControl
                        type="text"
                        className="form-control"
                    />
                </FormGroup>
            </td>
            <td data-label="TOTAL">
                Label
            </td>
            <td data-label="ACTION">
                <span className="cursor-pointer text-success mr-2 nav-icon font-weight-bold text-24" onClick={addNew}>
                    &oplus;
                </span>
                <span className="cursor-pointer text-danger mr-2 nav-icon font-weight-bold text-24" onClick={removeRo}>
                    &otimes;
                </span>
            </td>
        </tr>
    )
}

export default TableRow;