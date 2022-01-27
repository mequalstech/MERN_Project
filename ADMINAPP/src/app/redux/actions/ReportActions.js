import axios from "axios";
import { apiUrl } from "app/config";
import * as common from "app/services/common";

export const GET_CUSTOMER_REPORT = "GET_CUSTOMER_REPORT";
export const GET_VENDOR_REPORT = "GET_VENDOR_REPORT";
export const GET_INWARD_REGISTER_REPORT = "GET_INWARD_REGISTER_REPORT";
export const GET_ORDER_REGISTER_REPORT = "GET_ORDER_REGISTER_REPORT";
export const GET_ENQUIRY_REGISTER_REPORT = "GET_ENQUIRY_REGISTER_REPORT";


export const GET_PRODUCT_LIST_REPORT = "GET_PRODUCT_LIST_REPORT";
export const GET_STOCK_DETAILS_REPORT = "GET_STOCK_DETAILS_REPORT";
export const GET_STOCK_LEDGER_REPORT = "GET_STOCK_LEDGER_REPORT";

export const GET_CATEGORY_DROPDOWN_VALUES = "GET_CATEGORY_DROPDOWN_VALUES";
export const GET_SUBCATEGORY_DROPDOWN_VALUES = "GET_SUBCATEGORY_DROPDOWN_VALUES";
export const GET_PRODUCT_DROPDOWN_VALUES = "GET_PRODUCT_DROPDOWN_VALUES";
export const GET_VENDOR_DROPDOWN_VALUES = "GET_VENDOR_DROPDOWN_VALUES";
export const GET_CUSTOMER_DROPDOWN_VALUES = "GET_CUSTOMER_DROPDOWN_VALUES";

export const getCustomerReport = (filterData) => dispatch => {
    axios
        .post(apiUrl + "report/customer_report", filterData)
        .then(res => {
            var data = common.decryptJWT(res.data.token, true);
            dispatch({
                type: GET_CUSTOMER_REPORT,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};


export const getStockDetailsInventory = (filterData, setTableLoader) => dispatch => {
    axios
        .post(apiUrl + "report/stock_report", filterData)
        .then(res => {
            var data = common.decryptJWT(res.data.token, true);
            dispatch({
                type: GET_STOCK_DETAILS_REPORT,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        }).finally(() => {
            if(setTableLoader)
                setTableLoader(false);
        });
};


export const getStockLedgerInventory = (filterData, setTableLoader) => dispatch => {
    axios
        .post(apiUrl + "report/stock_ledger_report", filterData)
        .then(res => {
            var data = common.decryptJWT(res.data.token, true);
            dispatch({
                type: GET_STOCK_LEDGER_REPORT,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        }).finally(() => {
            if(setTableLoader)
                setTableLoader(false);
        });
};



export const getCategoryDropdownValues = (data) => dispatch => {
    axios
        .post(apiUrl + "get_data", { "type": "category" })
        .then(res => {
            var data = common.decryptJWT(res.data.token, true);
            let dropdownArr = []
            data.map((el, i) => {
                let obj = { label: el.category, value: el._id }
                dropdownArr.push(obj)
            });
            dispatch({
                type: GET_CATEGORY_DROPDOWN_VALUES,
                payload: dropdownArr
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};



export const getSubCategoryDropdownValues = (data) => dispatch => {
    axios
        .post(apiUrl + "get_data", { "type": "subcategory" })
        .then(res => {
            var data = common.decryptJWT(res.data.token, true);
            let dropdownArr = []
            data.map((el, i) => {
                let obj = { label: el.subcategory, value: el._id }
                dropdownArr.push(obj)
            });
            dispatch({
                type: GET_SUBCATEGORY_DROPDOWN_VALUES,
                payload: dropdownArr
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};



export const getProductDropdownValues = (data) => dispatch => {
    axios
        .post(apiUrl + "get_data", data)
        .then(res => {
            var data = common.decryptJWT(res.data.token, true);
            let dropdownArr = []
            data.map((el, i) => {
                let obj = { label: el.name, value: el._id }
                dropdownArr.push(obj)
            });
            dispatch({
                type: GET_PRODUCT_DROPDOWN_VALUES,
                payload: dropdownArr
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};

export const getVendorDropdownValues = (data) => dispatch => {
    axios
        .post(apiUrl + "vendor/list")
        .then(res => {
            var data = common.decryptJWT(res.data.token, true);
            let dropdownArr = []
            data.vendor.filter(_ => _.status === 1).map((el, i) => {
                let obj = { label: el.firstname + ' ' + el.lastname, value: el._id }
                dropdownArr.push(obj)
            });
            dispatch({
                type: GET_VENDOR_DROPDOWN_VALUES,
                payload: dropdownArr
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};



export const getCustomerDropdownValues = (data) => dispatch => {
    axios
        .post(apiUrl + "member/customer")
        .then(res => {
            var data = common.decryptJWT(res.data.token, true);
            let dropdownArr = [];
            data.filter(_ => _.status === 1).map((el, i) => {
                let obj = { label: el.name, value: el._id }
                dropdownArr.push(obj)
            });
            dispatch({
                type: GET_CUSTOMER_DROPDOWN_VALUES,
                payload: dropdownArr
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};


export const getInwardRegisterReport = (filterData) => dispatch => {
    axios
        .post(apiUrl + "report/inward_report", filterData)
        .then(res => {
            var data = common.decryptJWT(res.data.token, true);
            dispatch({
                type: GET_INWARD_REGISTER_REPORT,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};


export const getOrderRegisterReport = (filterData) => dispatch => {
    axios
        .post(apiUrl + "report/order_report", filterData)
        .then(res => {
            var data = common.decryptJWT(res.data.token, true);
            dispatch({
                type: GET_ORDER_REGISTER_REPORT,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};