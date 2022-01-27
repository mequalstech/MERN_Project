import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { apiUrl } from "app/config";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { Form } from "react-bootstrap";

import moment from 'moment';

export const datedate = {
  sdate: '',
  edate: '',
  label: ''
}

export class FilterComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      EnquiryListData: [],
      EnquiryListAll: [],
      enquiryNumber: '',
      customerName: '',
      status: '',
      customerNameData: [
        { value: 'MAEN_00001', label: 'MAEN_00001', target: { 'value': 'MAEN_00001', 'id': 'customerName' } },
        { value: 'MAEN_00002', label: 'MAEN_00002', target: { 'value': 'MAEN_00002', 'id': 'customerName' } }
      ],
      statusOptions: [
        { value: 'Active', label: 'Active', target: { 'value': 1, 'id': 'status' } },
        { value: 'Inactive', label: 'Inactive', target: { 'value': 2, 'id': 'status' } },
        { value: 'Delete', label: 'Delete', target: { 'value': 3, 'id': 'status' } },
        { value: 'Open', label: 'Open', target: { 'value': 4, 'id': 'status' } },
        { value: 'Completed', label: 'Completed', target: { 'value': 7, 'id': 'status' } },
        { value: 'Confirmed', label: 'Confirmed', target: { 'value': 8, 'id': 'status' } },
        { value: 'Frontend OrderCancel', label: 'Frontend OrderCancel', target: { 'value': 9, 'id': 'status' } },
        { value: 'Backend OrderCancel', label: 'Backend OrderCancel', target: { 'value': 10, 'id': 'status' } },
        { value: 'Out of Stock', label: 'Out of Stock', target: { 'value': 11, 'id': 'status' } },
      ]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  };

  /*
  *  Desc : Get Enquiry List Data through api call and generate data(EnquiryListAll) for table content
  */
  enquiryListData() {
    let data = {
      member_id: "",
      from_date: datedate.sdate,
      to_date: datedate.edate,
      status: this.state.status,
      id: '',
      enquiry_code: this.state.customerName,
    };
    //   {
    //     "member_id": "",
    //     "from_date":"2021-06-28",
    //     "to_date":"2021-08-03",
    //     "status":"",
    //     "id":"",
    //     "enquiry_code":""
    // }
    axios.post(apiUrl + 'order/list_enquiry_all', data)
      .then((res) => {
        this.setState({ EnquiryListData: res.data.data });
        this.setState({ EnquiryListAll: [] });

        this.state.EnquiryListData.map((el, i) => {
          let dateFormate = new Date(el.enquiry_date);
          let ampm = "AM";
          let hr = dateFormate.getHours();
          if (hr > 12) {
            hr = hr - 12;
            ampm = 'PM';
          }
          let enquiryDateVal = dateFormate.getMonth() + '-' + dateFormate.getDate() + '-' + dateFormate.getFullYear() + " " + hr + ':' + dateFormate.getMinutes() + ' ' + ampm;
          let data = {
            sNo: i + 1,
            enquiryDate: enquiryDateVal,
            enquiryNumber: el.code,
            customerName: el.member_name,
            phoneNumber: el.contact_no,
            quantity: el.final_qty,
            total: el.final_price,
            status: el.status,
            action: el._id
          }
          this.setState({
            EnquiryListAll: this.state.EnquiryListAll.concat(data)
          });
        })
        this.props.filterData(this.state);
      })
      .catch((err) => {
        console.log(err)
      })
  }

  /**
   *  Desc : handel input data on change and set them to state
   */
  handleChange(event) {
    if (event.target && event.target.id) {
    this.setState({ [event.target.id]: event.target.value });
    }
      
  }

  /***
   *    Desc : on form submit trigger api call for filter data
   */
  handleSubmit(event) {
    event.preventDefault();
    this.enquiryListData();
  }

  /***
   *    Desc : Reset the filter data on submit reset button
   */
  handleReset() {
    datedate.sdate = ''
    datedate.edate = ''
    datedate.label = ''
    this.setState({ customerName: '' })
    this.setState({ enquiryNumber: '' })
    this.setState({ status: '' });
    this.enquiryListData()
  }

  /***
   *    Desc : Get data from date range piccer 
   */
  date(s, e) {
    let dateFormates = new Date(s);
    let dateFormatee = new Date(e);
    datedate.sdate = (dateFormates.getMonth() + 1) + '-' + dateFormates.getDate() + '-' + dateFormates.getFullYear();
    datedate.edate = (dateFormatee.getMonth() + 1) + '-' + dateFormatee.getDate() + '-' + dateFormatee.getFullYear();

    (s.format('D MMMM YYYY') === e.format('D MMMM YYYY')) ? datedate.label = s.format('D MMMM YYYY') : datedate.label = s.format('D MMMM YYYY') + ' - ' + e.format('D MMMM YYYY');
  }

  /***
   *    Desc : Get table data on load
   */
  componentDidMount() {
    this.enquiryListData();
  }

  render() {
    const { stateData } = this.state;

    return (
      <div className="FilterComponent">
        <Form onSubmit={this.handleSubmit} className="row">
          <Form.Group className="col-sm-4">
            <Form.Label>Select Date Range</Form.Label>
            <DateRangePicker
              onApply={this.handleChange}
              initialSettings={
                {
                  startDate: moment().toDate(),
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
              onCallback={this.date}
            >
              <button className="form-control text-left" >{datedate.label}</button>
            </DateRangePicker>
          </Form.Group>


          {/* <Form.Group className="col-sm-4">
            <Form.Label>
              Enquiry number:
            </Form.Label>
            <Form.Control type="text" id="enquiryNumber" autoComplete="off" value={this.state.enquiryNumber} onChange={(e) => this.handleChange(e)}>
            </Form.Control>
          </Form.Group> */}


          <Form.Group className="col-sm-4">
            <Form.Label>Enquiry number:</Form.Label>
            <Select options={this.props.tableData && this.props.tableData.map(t => Object.assign({}, { value: t.enquiryNumber, label: t.enquiryNumber })) || []} placeholder={this.state.customerName} value={this.state.customerName} id="customerName" onChange={(e) => this.handleChange({target: Object.assign({}, { id: 'customerName', value: e.value })})} />
          </Form.Group>


          <Form.Group className="col-sm-4">
            <Form.Label>Status</Form.Label>
            <Select options={this.state.statusOptions} placeholder={this.state.status} value={this.state.status} id="status" onChange={(e) => this.handleChange(e)} />
          </Form.Group>


          <Form.Group className="col-sm-2">
            <button className="btn btn-outline-danger w-100 mt-4" type='submit' onClick={(e) => this.handleReset(e)} >Reset</button>
          </Form.Group>

          <Form.Group className="col-sm-2">
            <input className="btn btn-outline-primary w-100 mt-4" type="submit" value="Submit" />
          </Form.Group>

          <div className="col-sm-4"></div>
        </Form>
      </div>
    )
  }
}

export default FilterComponent;
