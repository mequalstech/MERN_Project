import React, { Component, useState } from "react";
import { Breadcrumb } from "@gull";
import { rootPath } from 'app/config';
import axios from 'axios';
import * as common from "app/services/common";
import 'bootstrap/dist/css/bootstrap.css';
import { NotificationContainer, NotificationManager } from "react-notifications";
import "./inventoryStyle.css";
import { Modal, Form, Button, Badge, Card, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { SimpleCard } from "@gull";
import { valid } from "semver";

const validateForm = errors => {
    let valid = false;
    Object.values(errors).forEach(val => {
        // console.log(val.length > 0, "length = ", val.length, val)
        if (val.length > 0 && valid === false) {
            valid = true;
        }
    });
    // console.log(valid)
    return valid;
};
export class Vendor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vendor_type: null,
            salutation: 'Mr',
            firstname: null,
            lastname: null,
            email: null,
            paymentterms: null,
            creditlimit: null,
            remarks: null,
            attachment: null,
            gstno_uin: null,
            createdby: null,
            billingattention: null,
            billingaddress1: null,
            billingaddress2: null,
            billingcountry: null,
            billingstate: null,
            billingcity: null,
            billingzipcode: null,
            billingphone: null,
            billingfax: null,
            shippingattention: null,
            shippingaddress1: null,
            shippingaddress2: null,
            shippingcountry: null,
            shippingstate: null,
            shippingcity: null,
            shippingzipcode: null,
            shippingphone: null,
            shippingfax: null,
            errors: {
                firstname: '',
                lastname: '',
                salutation: '',
                email: '',
                // billingattention: '',
                // billingaddress1: '',
                // billingaddress2: '',
                // billingcountry: '',
                // billingstate: '',
                // billingcity: '',
                billingzipcode: '',
                billingphone: '',
                // billingfax: '',
                // shippingattention: '',
                // shippingaddress1: '',
                // shippingaddress2: '',
                // shippingcountry: '',
                // shippingstate: '',
                // shippingcity: '',
                shippingzipcode: '',
                shippingphone: '',
                // shippingfax: '',
                paymentterms:'',
                // creditlimit:'',
                // attachment:'',
                // status:'',
                // createdby:'',
            },
            vendorType: props.isNewVendor,
            constVendorType: 'Add',
            updateId: '',
            BillingCheckbox: false,
            FlagEmptyCheck: false,
            flagSubmitBtn:false,
            flagcheckbox:true,
        };
    }

    handleChange = (event) => {
        event.preventDefault();
        // console.log(event, 'target', event.target, 'name', event.target.name, 'value', event.target.value);
        
        const { name, value } = event.target;
        const data = event.target.name
        this.setState({ data: event.target.value })
        let errors = this.state.errors;
        switch (name) {
            case 'firstname': errors.firstname = (value.length < 1) ? 'Enter Valid First Name' : ''; break;
            case 'lastname': errors.lastname = value.length < 1 ? 'Enter Valid Last Name' : ''; break;
            case 'salutation': errors.salutation = value.length <= 1 ? 'enter valid salutation' : ''; break;
            case 'email': 
                var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
                // console.log(pattern.test(value),value.length > 3)
                if(pattern.test(value)&&value.length > 3){
                    errors.email='';
                }
                else{
                    errors.email='Enter Valid Email';
                }
                                 break;
            case 'paymentterms':errors.paymentterms=value.length >7 ? 'Enter Valid Phone Number' : '';
                                if(!(value.charAt(0)==='6'||value.charAt(0)==='7'||value.charAt(0)==='8'||value.charAt(0)==='9')){
                                    errors.paymentterms='Enter Valid Mobile Number';
                                }
                                break;
            case 'billingphone':errors.billingphone=value.length >7 ? 'Enter Valid Phone Number' : '';
                                if(!(value.charAt(0)==='6'||value.charAt(0)==='7'||value.charAt(0)==='8'||value.charAt(0)==='9')){
                                    errors.billingphone='Enter Valid Phone';
                                }
                                break;
            case 'shippingphone':errors.shippingphone=value.length >7 ? 'Enter Valid Phone Number' : '';
                                if(!(value.charAt(0)==='6'||value.charAt(0)==='7'||value.charAt(0)==='8'||value.charAt(0)==='9')){
                                    errors.shippingphone='Enter Valid Phone';
                                }
                                break;

            case 'shippingzipcode':errors.shippingzipcode=value.length >7 ? 'Enter Valid Zip Code' : '';
                                    if(!(value.charAt(0)==='1'||value.charAt(0)==='2'||value.charAt(0)==='0')&&value.length>=1){
                                        errors.shippingzipcode='Enter Valid Zip Code';
                                    }
                                    else{
                                        errors.shippingzipcode='';
                                    }
                                    break;
            case 'billingzipcode':errors.billingzipcode=value.length >7 ? 'Enter Valid Zip Code' : '';
                                if(!(value.charAt(0)==='1'||value.charAt(0)==='2'||value.charAt(0)==='0')&&value.length>=1){
                                    errors.billingzipcode='Enter Valid Zip Code';
                                }
                                else{
                                    errors.billingzipcode='';
                                }
                                break;
            
            default:
                break;
        }
        
        this.setState({ errors, [name]: value }, () => {
            console.log(errors)
        })
        this.setState({ errors, [name]: value });
    }

    handleSubmit = (event, value) => {
        this.setState({flagSubmitBtn:true})
        event.preventDefault();
        event.preventDefault();
        let emptyCheck1,emptyCheck2,emptyCheck3 = false;
        ((this.state.firstname === null || this.state.firstname === undefined || this.state.firstname === '') ) ? emptyCheck1 = true : emptyCheck1 = false;
        ((this.state.lastname === null || this.state.lastname === undefined || this.state.lastname === '') ) ? emptyCheck2 = true : emptyCheck2 = false;
        ((this.state.email === null || this.state.email === undefined || this.state.email === '')) ? emptyCheck3 = true : emptyCheck3 = false;
        
        let adddata = {
            vendor_type: "60d2eb2b14f57d6346c688ff",
            salutation: this.state.salutation,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            paymentterms: this.state.paymentterms,
            creditlimit: this.state.creditlimit,
            remarks: this.state.remarks,
            attachment: this.state.attachment,
            gstno_uin: this.state.gstno_uin,
            createdby: "60d2eb2b14f57d6346c688ff",
            address:
                [
                    {
                        type: "Billing",
                        attention: this.state.billingattention,
                        country: this.state.billingcountry,
                        address1: this.state.billingaddress1,
                        address2: this.state.billingaddress2,
                        city: this.state.billingcity,
                        state: this.state.billingstate,
                        zipcode: this.state.billingzipcode,
                        phone: this.state.billingphone,
                        fax: 300
                    },
                    {
                        type: "Shipping",
                        attention: (this.state.flagcheckbox) ? this.state.billingattention : this.state.shippingattention,
                        country: (this.state.flagcheckbox) ? this.state.billingcountry : this.state.shippingcountry,
                        address1: (this.state.flagcheckbox) ? this.state.billingaddress1 : this.state.shippingaddress1,
                        address2: (this.state.flagcheckbox) ? this.state.billingaddress2 : this.state.shippingaddress2,
                        city: (this.state.flagcheckbox) ? this.state.billingcity : this.state.shippingcity,
                        state: (this.state.flagcheckbox) ? this.state.billingstate : this.state.shippingstate,
                        zipcode: (this.state.flagcheckbox) ? this.state.billingzipcode : this.state.shippingzipcode,
                        phone: (this.state.flagcheckbox) ? this.state.billingphone : this.state.shippingphone,
                        fax: 300
                    }
                ],
            activities: [{
                activity: "vendor",
                subject: "vendor",
                details: "vendor",
                createdby: "60d2eb2b14f57d6346c688ff"
            }]
        }
        let updatedata = {
            _id: this.state.vendorType._id,
            vendor_type: "60d2eb2b14f57d6346c688ff",
            salutation: this.state.salutation,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            paymentterms: this.state.paymentterms,
            creditlimit: this.state.creditlimit,
            remarks: this.state.remarks,
            attachment: this.state.attachment,
            gstno_uin: this.state.gstno_uin,
            createdby: "60d2eb2b14f57d6346c688ff",
            address:
                [
                    {
                        type: "Billing",
                        attention: this.state.billingattention,
                        country: this.state.billingcountry,
                        address1: this.state.billingaddress1,
                        address2: this.state.billingaddress2,
                        city: this.state.billingcity,
                        state: this.state.billingstate,
                        zipcode: this.state.billingzipcode,
                        phone: this.state.billingphone,
                        fax: 300
                    },
                    {
                        type: "Shipping",
                        attention: (this.state.flagcheckbox) ? this.state.billingattention : this.state.shippingattention,
                        country: (this.state.flagcheckbox) ? this.state.billingcountry : this.state.shippingcountry,
                        address1: (this.state.flagcheckbox) ? this.state.billingaddress1 : this.state.shippingaddress1,
                        address2: (this.state.flagcheckbox) ? this.state.billingaddress2 : this.state.shippingaddress2,
                        city: (this.state.flagcheckbox) ? this.state.billingcity : this.state.shippingcity,
                        state: (this.state.flagcheckbox) ? this.state.billingstate : this.state.shippingstate,
                        zipcode: (this.state.flagcheckbox) ? this.state.billingzipcode : this.state.shippingzipcode,
                        phone: (this.state.flagcheckbox) ? this.state.billingphone : this.state.shippingphone,
                        fax: 300
                    }
                ],
            activities: [{
                activity: "vendor",
                subject: "vendor",
                details: "vendor",
                createdby: "60d2eb2b14f57d6346c688ff"
            }]
        }
        // console.log(adddata,updatedata)
        if (!validateForm(this.state.errors) && !emptyCheck1 && !emptyCheck2 && !emptyCheck3) {
            let url = (this.state.vendorType === '') ? 'vendor/add' : 'vendor/update';
            let data = (this.state.vendorType === '') ? adddata : updatedata;
            console.log('request',data)
            axios
                .post("http://algrix.in:1430/" + url, data)
                .then((res) => {
                    NotificationManager.success(
                        res.data.message
                    );
                    setTimeout(() => {
                        this.props.vendorManage();
                    }, 500);
                })
                .catch((err) => {
                    NotificationManager.warning(
                        err.message
                    );
                })
        }
        else {
            NotificationManager.warning(
                "invalid Form"
            );
        }

    }

    cancel = () => {

        this.props.vendorManage();
    }
    checkbox = (event) => {
        this.setState({flagcheckbox:!this.state.flagcheckbox})

    }

    handleAttachments=(event)=>{
        let data=event.target.files[0]
        this.setState({attachment:data})
    }

    onKeyUp=(event)=>{
        let type=event.target.name;
       
        switch (type) {
            case 'firstname':type='strVal';break;
            case 'lastname':type='strVal';break;
            case 'paymentterms':type='numbersonly';if(event.target.value.length>=7){event.preventDefault();};break;
            case 'creditlimit':type='numbersonly';if(event.target.value.length>=8){event.preventDefault();};break;
            case 'billingaddress1':type='alphaNumeric';if(event.target.value.length>=18){event.preventDefault();};break;
            case 'billingaddress2':type='alphaNumeric';if(event.target.value.length>=18){event.preventDefault();};break;
            case 'billingzipcode':type='numbersonly';if(event.target.value.length>=5){event.preventDefault();};break;
            case 'billingphone':type='numbersonly';if(event.target.value.length>=7){event.preventDefault();};break;
            case 'shippingaddress1':type='alphaNumeric';if(event.target.value.length>=18){event.preventDefault();};break;
            case 'shippingaddress2':type='alphaNumeric';if(event.target.value.length>=18){event.preventDefault();};break;
            case 'shippingzipcode':type='numbersonly';if(event.target.value.length>=5){event.preventDefault();};break;
            case 'shippingphone':type='numbersonly';if(event.target.value.length>=7){event.preventDefault();};break;
        }
        // event.target.name
        // event.preventDefault();
    const numbersonly = /[0-9\-\ ]/;
    const strOnly = /^[A-Za-z ]+$/;
    const inputs = /^[a-zA-Z0-9,. ]*$/;
    const alphaNumeric = /^[A-Za-z0-9 ]*$/;
    const emailRegex =/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})$/;
    if (event.code == 'Space' && (event.target.value.length < 1)) {
      event.preventDefault();
    }

    /**String Validation */
    switch (type) {
      case 'strVal':
        let inputChar1 = String.fromCharCode(event.charCode);
        if (!strOnly.test(inputChar1)) {
          event.preventDefault();

        }
        break;
      case 'numbersonly':
        let inputChar2 = String.fromCharCode(event.charCode);
        if (!numbersonly.test(inputChar2)) {
          event.preventDefault();
        }
        break;
      case 'inputs':
        let inputChar3 = String.fromCharCode(event.charCode);
        if (!inputs.test(inputChar3)) {
          event.preventDefault();
        }
        break;
      
      case 'alphaNumeric':
        let inputChar5 = String.fromCharCode(event.charCode);
        if (!alphaNumeric.test(inputChar5)) {
          event.preventDefault();
        }
        break;
      
      default:
        return;
    }
    }



    /***
     *    Desc : Get table data on load
     */
    componentDidMount() {
        this.setState({ updateId: this.state.vendorType?._id })
        console.log(this.state.vendorType);
        console.log(this.state.gst_number);
        
        let url = (this.state.vendorType === '') ? 'add' : 'update';
        if (url === 'update') {
            let data=this.state.vendorType.remarks;
            let type;
            switch (data) {
                case '1':type='GST Registered - Regular';break;
                case '2':type='GST Registered - Composition';break;
                case '3':type='GST UnRegistered';break;
                case '4':type='Consumer';break;
            }
            this.setState({ tableBody: [] });
            this.setState({ constVendorType: 'Update' })
            this.setState({ vendor_type: this.state.vendorType.vendor_type })
            this.setState({ salutation: this.state.vendorType.salutation })
            this.setState({ firstname: this.state.vendorType.firstname })
            this.setState({ lastname: this.state.vendorType.lastname })
            this.setState({ email: this.state.vendorType.email })
            this.setState({ paymentterms: this.state.vendorType.paymentterms })
            this.setState({ creditlimit: this.state.vendorType.creditlimit })
            this.setState({ remarks: type })
            this.setState({ attachment: this.state.vendorType.attachment })
            this.setState({ gstno_uin: this.state.vendorType.gstno_uin })
            this.setState({ createdby: this.state.vendorType.createdby })
            this.setState({ billingattention: this.state.vendorType.address[0]?.attention })
            this.setState({ billingaddress1: this.state.vendorType.address[0]?.address1 })
            this.setState({ billingaddress2: this.state.vendorType.address[0]?.address2 })
            this.setState({ billingcountry: this.state.vendorType.address[0]?.country })
            this.setState({ billingstate: this.state.vendorType.address[0]?.state })
            this.setState({ billingcity: this.state.vendorType.address[0]?.city })
            this.setState({ billingzipcode: this.state.vendorType.address[0]?.zipcode })
            this.setState({ billingphone: this.state.vendorType.address[0]?.phone })
            this.setState({ billingfax: this.state.vendorType.address[0]?.fax })
            this.setState({ shippingattention: this.state.vendorType.address[1]?.attention })
            this.setState({ shippingaddress1: this.state.vendorType.address[1]?.address1 })
            this.setState({ shippingaddress2: this.state.vendorType.address[1]?.address2 })
            this.setState({ shippingcountry: this.state.vendorType.address[1]?.country })
            this.setState({ shippingstate: this.state.vendorType.address[1]?.state })
            this.setState({ shippingcity: this.state.vendorType.address[1]?.city })
            this.setState({ shippingzipcode: this.state.vendorType.address[1]?.zipcode })
            this.setState({ shippingphone: this.state.vendorType.address[1]?.phone })
            this.setState({ shippingfax: this.state.vendorType.address[1]?.fax })
        }

    }
    render() {
        const { errors, address, constVendorType } = this.state;
        return (

            <div className='wrapper cls-vendor'>
                <Breadcrumb
                    routeSegments={[
                        { name: "Manage Vendor", path: rootPath + "inventory/manage-vendor", type: "link" },
                        { name: constVendorType + " Vendor" }
                    ]}
                ></Breadcrumb>
                <NotificationContainer />

                <SimpleCard>
                    <Form className="needs-validation" onSubmit={this.handleSubmit} noValidate autoComplete="off">
                        <Card.Header>
                            <Card.Title className="m-0">{constVendorType} Vendor Detail</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="row">
                                <div className="col-md-12">
                                    <Form.Row className="col-md-12 p-0">
                                        <FormGroup className="col-md-4 mb-0">
                                            <div className="col-md-12 pl-0 d-flex align-items-center">
                                                <div className="col-md-3 p-0 mr-2 salutation">
                                                    <FormLabel className="font-weight-bold">Salutation <span  className='error ml-2'>*</span></FormLabel>
                                                    <FormControl
                                                        as="select"
                                                        className="form-control col-md-12"
                                                        name="salutation" onChange={this.handleChange}
                                                    >
                                                        <option value="MR">{this.state.salutation === null||this.state.salutation === ''
                                                                    ? 'Mr' : this.state.salutation}</option>
                                                        <option value="Mr">Mr.</option>
                                                        <option value="Miss">Miss.</option>
                                                    </FormControl>
                                                    {errors.salutation.length > 0 &&
                                                        <span className='error'>{errors.salutation}</span>}
                                                </div>
                                                <div className="col-md-5 p-0 mr-1 firstname">
                                                    <FormLabel className="font-weight-bold">First Name<span  className='error ml-2'>*</span></FormLabel>
                                                    <FormControl type="text" className="form-control col-md-12" autoComplete="off" value={this.state.firstname === null ? null : this.state.firstname}
                                                        placeholder={this.state.firstname === null ||this.state.firstname === ''? 'first name' : ''}
                                                        name='firstname' onKeyPress={this.onKeyUp} onChange={this.handleChange} noValidate />
                                                    {errors.firstname.length > 0 &&
                                                        <span className='error'>{errors.firstname}</span>}
                                                        {((this.state.firstname === null || this.state.firstname === undefined || this.state.firstname === '')&&this.state.flagSubmitBtn)?<span className='error'>Enter Valid First Name</span>:''}
                                                </div>
                                                <div className="col-md-4 p-0 lastname">
                                                    <FormLabel className="font-weight-bold">Last Name <span  className='error ml-2'>*</span></FormLabel>
                                                    <FormControl type="text" className="form-control col-md-12" value={this.state.lastname === null ? null : this.state.lastname}
                                                        placeholder={this.state.lastname === null ||this.state.lastname === '' ? 'last name' : ''}
                                                        name='lastname' onChange={this.handleChange} onKeyPress={this.onKeyUp} noValidate />
                                                    {errors.lastname.length > 0 &&
                                                        <span className='error'>{errors.lastname}</span>}
                                                        
                                                        {((this.state.lastname === null || this.state.lastname === undefined || this.state.lastname === '')&&this.state.flagSubmitBtn)?<span className='error'>Enter Valid Last Name</span>:''}
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="email col-md-4  mb-0">
                                            <FormLabel className="font-weight-bold">Email <span  className='error ml-2'>*</span></FormLabel>
                                            <FormControl type="text" className="form-control col-md-12" autoComplete="off" value={this.state.email === null ? null : this.state.email}
                                                placeholder={this.state.email === null ||this.state.email === ''? 'Email' : ''}
                                                name='email' onChange={this.handleChange} noValidate />
                                            {errors.email.length > 0 &&
                                                <span className='error'>{errors.email}</span>}
                                                {((this.state.email === null || this.state.email === undefined || this.state.email === '')&&this.state.flagSubmitBtn)?<span className='error'>Enter Valid Email</span>:''}
                                        </FormGroup>
                                        <FormGroup className="paymentterms col-md-4 mb-0">
                                            <FormLabel className="font-weight-bold">Mobile Number</FormLabel>
                                            <FormControl type="text" className="form-control col-md-12" autoComplete="off" value={this.state.paymentterms === null ? null : this.state.paymentterms}
                                                placeholder={this.state.paymentterms === null||this.state.paymentterms === '' ? 'Mobile Number' : ''}
                                                name='paymentterms'  onKeyPress={this.onKeyUp} onChange={this.handleChange} noValidate />
                                            {errors.paymentterms.length > 0 &&
                                            <span className='error'>{errors.paymentterms}</span>
                                            }
                                        </FormGroup>
                                    </Form.Row>
                                </div>
                                <div className="col-md-12">
                                    <Form.Row className="col-md-12 p-0 d-flex align-items-center">
                                        <FormGroup className="creditlimit col-md-4  mb-0">
                                            <FormLabel className="font-weight-bold">Credit Limit</FormLabel>
                                            <FormControl type="text" onKeyPress={this.onKeyUp} className="form-control col-md-12" autoComplete="off" 
                                            value={this.state.creditlimit === null ? null : this.state.creditlimit}
                                                placeholder={this.state.creditlimit === null||this.state.creditlimit === '' ? 'credit limit' : ''}
                                                name='creditlimit' onChange={this.handleChange} noValidate />
                                            {/* {errors.creditlimit.length > 0 &&
                                            <span className='error'>{errors.creditlimit}</span>
                                            } */}
                                        </FormGroup>
                                        <FormGroup className="col-md-4  mb-0">
                                            <FormLabel className="font-weight-bold">GST Type</FormLabel>
                                            <FormControl as="select"  name="remarks" className="form-control col-md-12" onChange={this.handleChange} noValidate
                                            >
                                                <option value="" hidden>{this.state.remarks === null||this.state.remarks === ''
                                                                    ? 'Select GST Type' : this.state.remarks}</option>
                                                <option value="1">GST Registered - Regular</option>
                                                <option value="2">GST Registered - Composition</option>
                                                <option value="3">GST UnRegistered</option>
                                                <option value="4">Consumer</option>
                                            </FormControl>
                                        </FormGroup>
                                        <FormGroup className="col-md-4 mt-4  mb-0">
                                            <FormLabel className="font-weight-bold" >GST Number</FormLabel>
                                            <FormControl type="text" name="gstno_uin" className="form-control col-md-12"
                                             placeholder={this.state.gstno_uin === null||this.state.gstno_uin === ''
                                                                    ? 'GST Number' : this.state.gstno_uin}
                                                                     onChange={this.handleChange} noValidate />
                                            Not yet GST registered? Register at <a href="https://www.gst.gov.in/" rel="noopener noreferrer" target="_blank">Here</a>
                                        </FormGroup>
                                    </Form.Row>
                                </div>
                                <div className="col-md-12 d-none">
                                    <Form.Row className="col-md-12 p-0 d-flex align-items-center">
                                        <FormGroup className="col-md-4 fileInput">
                                            <FormLabel className="font-weight-bold">Attachment</FormLabel>
                                            <FormControl type="file" className="form-control col-md-12" onChange={this.handleAttachments} />
                                        </FormGroup>
                                    </Form.Row>
                                </div>

                                <div className="d-flex align-items-center mt-4 pt-1">
                                    <div>
                                        <Card.Header>
                                            <Card.Title className="m-0">Billing Address</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <Form.Row className="col-md-12 p-0 d-flex align-items-center">
                                                        <FormGroup className="billingattention col-md-6">
                                                            <FormLabel className="font-weight-bold">Attention</FormLabel>
                                                            <FormControl type="text" className="form-control col-md-12" autoComplete="off" value={this.state.billingattention === null ? null :
                                                                this.state.billingattention} placeholder={this.state.billingattention === null||this.state.billingattention === '' ? 'enter attention'
                                                                    : ''} name='billingattention' onChange={this.handleChange}
                                                                noValidate />
                                                            {/* {errors.billingattention.length > 0 &&
                                                                <span className='error'>{errors.billingattention}</span>
                                                            } */}
                                                        </FormGroup>
                                                        <FormGroup className="billingaddress1 col-md-6">
                                                            <FormLabel className="font-weight-bold">Address1</FormLabel>
                                                            <FormControl type="text" className="form-control col-md-12" autoComplete="off" value={this.state.billingaddress1 === null ? null :
                                                                this.state.billingaddress1} placeholder={this.state.billingaddress1 === null||this.state.billingaddress1 === '' ? 'enter address1'
                                                                    : ''} name='billingaddress1' onKeyPress={this.onKeyUp} onChange={this.handleChange}
                                                                noValidate />
                                                            {/* {errors.billingaddress1.length > 0 &&
                                                                <span className='error'>{errors.billingaddress1}</span>
                                                            } */}
                                                        </FormGroup>
                                                    </Form.Row>
                                                </div>
                                                <div className="billingaddress2 col-md-12">
                                                    <Form.Row className="col-md-12 p-0 d-flex align-items-center">
                                                        <FormGroup className="col-md-6">
                                                            <FormLabel className="font-weight-bold">Address2</FormLabel>
                                                            <FormControl type="text" className="form-control col-md-12" autoComplete="off" value={this.state.billingaddress2 === null ? null :
                                                                this.state.billingaddress2} onKeyPress={this.onKeyUp} placeholder={this.state.billingaddress2 === null||this.state.billingaddress2 === ''
                                                                    ? 'enter address2' : ''} name='billingaddress2'
                                                                onChange={this.handleChange} noValidate />
                                                            {/* {errors.billingaddress2.length > 0 &&
                                                                <span className='error'>{errors.billingaddress2}</span>
                                                            } */}
                                                        </FormGroup>
                                                        <FormGroup className="billingcountry col-md-6">
                                                            <FormLabel className="font-weight-bold">Country</FormLabel>
                                                            <FormControl as="select" className="form-control col-md-12"
                                                            name="billingcountry" id="billingcountry" onChange={this.handleChange} autoComplete="off"  >
                                                                <option key = '' hidden value=''>  {this.state.billingcountry === null||this.state.billingcountry === ''
                                                                    ? 'Enter Country' : this.state.billingcountry}</option>
                                                                <option value="India">India</option>
                                                                <option value="Dubai">Dubai</option>
                                                            </FormControl>
                                                            {/* {errors.billingcountry.length > 0 &&
                                                                <span className='error'>{errors.billingcountry}</span>
                                                            } */}
                                                        </FormGroup>
                                                    </Form.Row>
                                                </div>
                                                <div className="col-md-12">
                                                    <Form.Row className="col-md-12 p-0 d-flex align-items-center">
                                                        <FormGroup className="billingstate col-md-6">
                                                            <FormLabel className="font-weight-bold">State</FormLabel>
                                                                <FormControl as="select" id="billingstate" className="form-control col-md-12"
                                                            name="billingstate" onChange={this.handleChange} autoComplete="off"  >
                                                                <option key = '' hidden value=''>  {this.state.billingstate === null||this.state.billingstate === ''
                                                                    ? 'Enter State' : this.state.billingstate}</option>
                                                                <option value="Tamil Nadu">Tamil Nadu</option>
                                                                <option value="Kerala">Kerala</option>
                                                            </FormControl>
                                                            {/* {errors.billingstate.length > 0 &&
                                                                <span className='error'>{errors.billingstate}</span>
                                                            } */}
                                                        </FormGroup>
                                                        <FormGroup className="billingcity col-md-6">
                                                            <FormLabel className="font-weight-bold">City</FormLabel>
                                                            <FormControl as="select" className="form-control col-md-12"
                                                            name="billingcity" id="billingcity" onChange={this.handleChange} autoComplete="off">
                                                                <option key = '' hidden value=''>  {this.state.billingcity === null||this.state.billingcity === ''
                                                                    ? 'Enter City' : this.state.billingcity}</option>
                                                                <option value="Chennai">Chennai</option>
                                                                <option value="Madurai">Madurai</option>
                                                            </FormControl>
                                                            {/* {errors.billingcity.length > 0 &&
                                                                <span className='error'>{errors.billingcity}</span>
                                                            } */}
                                                        </FormGroup>
                                                    </Form.Row>
                                                </div>
                                                <div className="col-md-12">
                                                    <Form.Row className="col-md-12 p-0 d-flex align-items-center">
                                                        <FormGroup className="billingzipcode col-md-6">
                                                            <FormLabel className="font-weight-bold">Zip Code</FormLabel>
                                                            <FormControl type="text" className="form-control col-md-12" autoComplete="off" value={this.state.billingzipcode === null ? null :
                                                                this.state.billingzipcode} placeholder={this.state.billingzipcode === null||this.state.billingzipcode === '' ? 'enter zip code' : ''
                                                                } name='billingzipcode' onChange={this.handleChange} onKeyPress={this.onKeyUp}
                                                                noValidate />
                                                            {errors.billingzipcode.length > 0 &&
                                                                <span className='error'>{errors.billingzipcode}</span>
                                                            }
                                                        </FormGroup>
                                                        <FormGroup className="billingphone col-md-6">
                                                            <FormLabel className="font-weight-bold">Phone</FormLabel>
                                                            <FormControl type="text" className="form-control col-md-12" value={this.state.billingphone === null ? null : this.state.billingphone}
                                                                placeholder={this.state.billingphone === null||this.state.billingphone === '' ? 'enter phone' : ''}
                                                                name='billingphone' onChange={this.handleChange} noValidate onKeyPress={this.onKeyUp} />
                                                            {errors.billingphone.length > 0 &&
                                                                <span className='error'>{errors.billingphone}</span>
                                                            }
                                                        </FormGroup>
                                                    </Form.Row>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </div>
                                    <div>
                                        <Card.Header className="d-flex align-items-center justify-content-between">
                                            <Card.Title className="m-0">Shipping Address{this.state.flagcheckbox}</Card.Title>
                                            <div>
                                                <input type="checkbox" id="billingCheckbox " onChange={this.handleChange} onClick={this.checkbox} checked={this.state.flagcheckbox} class={this.state.flagcheckbox?'checked':'unchecked'}/>
                                                <label className="ml-2 mb-0">
                                                    Same As Billing Address {this.state.flagcheckbox}
                                                </label>
                                            </div>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <Form.Row className="col-md-12 p-0 d-flex align-items-center">
                                                        <FormGroup className="shippingattention col-md-6">
                                                            <FormLabel className="font-weight-bold">Attention</FormLabel>
                                                            <FormControl disabled={this.state.flagcheckbox}  type="text" className="form-control col-md-12" autoComplete="off" value={this.state.shippingattention === null ? null :
                                                                this.state.shippingattention} placeholder={this.state.shippingattention === null||this.state.shippingattention === ''
                                                                    ? 'enter attention' : ''} name='shippingattention' id='shippingattention'
                                                                onChange={this.handleChange} noValidate />
                                                            {/* {errors.shippingattention.length > 0 &&
                                                                <span className='error'>{errors.shippingattention}</span>
                                                            } */}
                                                        </FormGroup>
                                                        <FormGroup className="shippingaddress1 col-md-6">
                                                            <FormLabel className="font-weight-bold">Address1</FormLabel>
                                                            <FormControl disabled={this.state.flagcheckbox}  type="text" className="form-control col-md-12" autoComplete="off" value={this.state.shippingaddress1 === null ? null :
                                                                this.state.shippingaddress1} placeholder={this.state.shippingaddress1 === null ||this.state.shippingaddress1 === ''? 'enter address1'
                                                                    : ''} name='shippingaddress1' onKeyPress={this.onKeyUp} id='shippingaddress1' onChange={this.handleChange}
                                                                noValidate />
                                                            {/* {errors.shippingaddress1.length > 0 &&
                                                                <span className='error'>{errors.shippingaddress1}</span>
                                                            } */}
                                                        </FormGroup>
                                                    </Form.Row>
                                                </div>
                                                <div className="col-md-12">
                                                    <Form.Row className="col-md-12 p-0 d-flex align-items-center">
                                                        <FormGroup className="shippingaddress2 col-md-6">
                                                            <FormLabel className="font-weight-bold">Address2</FormLabel>
                                                            <FormControl disabled={this.state.flagcheckbox}  type="text" className="form-control col-md-12" autoComplete="off" value={this.state.shippingaddress2 === null ? null :
                                                                this.state.shippingaddress2} placeholder={this.state.shippingaddress2 === null||this.state.shippingaddress2 === ''
                                                                    ? 'enter address2 ' : ''} onKeyPress={this.onKeyUp} name='shippingaddress2' id='shippingaddress2'
                                                                onChange={this.handleChange} noValidate />
                                                            {/* {errors.shippingaddress2.length > 0 &&
                                                                <span className='error'>{errors.shippingaddress2}</span>
                                                            } */}
                                                        </FormGroup>
                                                        <FormGroup className="shippingcountry col-md-6">
                                                            <FormLabel className="font-weight-bold">Country</FormLabel>
                                                            <FormControl disabled={this.state.flagcheckbox}  as="select" className="form-control col-md-12"
                                                            name="shippingcountry" id="shippingcountry" onChange={this.handleChange} autoComplete="off" >
                                                                <option key = '' hidden value=''>  {this.state.shippingcountry === null||this.state.shippingcountry === ''
                                                                    ? 'Enter Country' : this.state.shippingcountry}</option>
                                                                <option value="India">India</option>
                                                                <option value="Dubai">Dubai</option>
                                                            </FormControl>
                                                            {/* {errors.shippingcountry.length > 0 &&
                                                                <span className='error'>{errors.shippingcountry}</span>
                                                            } */}
                                                        </FormGroup>
                                                    </Form.Row>
                                                </div>
                                                <div className="col-md-12">
                                                    <Form.Row className="col-md-12 p-0 d-flex align-items-center">
                                                        <FormGroup className="shippingstate col-md-6">
                                                            <FormLabel className="font-weight-bold">State</FormLabel>
                                                                <FormControl disabled={this.state.flagcheckbox}  as="select" className="form-control col-md-12"
                                                            name="shippingstate" id="shippingstate" onChange={this.handleChange} autoComplete="off"  >
                                                            <option key = '' hidden value=''>  {this.state.shippingstate === null||this.state.shippingstate === ''
                                                                    ? 'Enter State' : this.state.shippingstate}</option>
                                                                <option value="Tamil Nadu">Tamil Nadu</option>
                                                                <option value="Kerala">Kerala</option>
                                                            </FormControl>
                                                            {/* {errors.shippingstate.length > 0 &&
                                                                <span className='error'>{errors.shippingstate}</span>
                                                            } */}
                                                        </FormGroup>
                                                        <FormGroup className="shippingcity col-md-6">
                                                            <FormLabel className="font-weight-bold">City</FormLabel>
                                                            <FormControl disabled={this.state.flagcheckbox}  as="select" className="form-control col-md-12"
                                                            name="shippingcity" id="shippingcity" onChange={this.handleChange} autoComplete="off">
                                                                <option key = '' hidden value=''>  {this.state.shippingcity === null||this.state.shippingcity === ''
                                                                    ? 'Enter City' : this.state.shippingcity}</option>
                                                                <option value="Chennai">Chennai</option>
                                                                <option value="Madurai">Madurai</option>
                                                            </FormControl>
                                                            {/* {errors.shippingcity.length > 0 &&
                                                                <span className='error'>{errors.shippingcity}</span>
                                                            } */}
                                                        </FormGroup>
                                                    </Form.Row>
                                                </div>
                                                <div className="col-md-12">
                                                    <Form.Row className="col-md-12 p-0 d-flex align-items-center">
                                                        <FormGroup className="shippingzipcode col-md-6">
                                                            <FormLabel className="font-weight-bold">Zip Code</FormLabel>
                                                            <FormControl disabled={this.state.flagcheckbox}  type="text" className="form-control col-md-12" autoComplete="off" value={this.state.shippingzipcode === null ? null :
                                                                this.state.shippingzipcode} placeholder={this.state.shippingzipcode === null||this.state.shippingzipcode === '' ? 'Enter zip code'
                                                                    : ''} name='shippingzipcode' onKeyPress={this.onKeyUp} id='shippingzipcode' onChange={this.handleChange}
                                                                noValidate />
                                                            {errors.shippingzipcode.length > 0 &&
                                                                <span className='error'>{errors.shippingzipcode}</span>
                                                            }
                                                        </FormGroup>
                                                        <FormGroup className="shippingphone col-md-6">
                                                            <FormLabel className="font-weight-bold">Phone</FormLabel>
                                                            <FormControl disabled={this.state.flagcheckbox}  type="text" className="form-control col-md-12" autoComplete="off" value={this.state.shippingphone === null ? null : this.state.shippingphone}
                                                                placeholder={this.state.shippingphone === null ||this.state.shippingphone === ''? 'Enter Phone' : ''}
                                                                name='shippingphone' id='shippingphone' onKeyPress={this.onKeyUp} onChange={this.handleChange} noValidate />
                                                            {errors.shippingphone.length > 0 &&
                                                                <span className='error'>{errors.shippingphone}</span>
                                                            }
                                                        </FormGroup>
                                                    </Form.Row>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <div className='col-md-12 text-right submit'>
                                <Button variant="outline-danger m-1 text-capitalize" onClick={this.cancel}>Cancel</Button>
                                <Button type="submit" variant="outline-primary m-1 text-capitalize">{(this.state.vendorType === '') ? 'Submit' : 'Update'}</Button>
                            </div>
                        </Card.Footer>
                    </Form>
                </SimpleCard>
            </div >
        )
    }
}
export default Vendor;
