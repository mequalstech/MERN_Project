import {
    GET_CUSTOMER_REPORT,
    GET_VENDOR_REPORT,
    GET_INWARD_REGISTER_REPORT,
    GET_ORDER_REGISTER_REPORT,
    GET_ENQUIRY_REGISTER_REPORT,
    GET_PRODUCT_LIST_REPORT,
    GET_STOCK_DETAILS_REPORT,
    GET_STOCK_LEDGER_REPORT,
    GET_CATEGORY_DROPDOWN_VALUES,
    GET_SUBCATEGORY_DROPDOWN_VALUES,
    GET_PRODUCT_DROPDOWN_VALUES,
    GET_VENDOR_DROPDOWN_VALUES,
    GET_CUSTOMER_DROPDOWN_VALUES
} from "../actions/ReportActions";

const initialState = {
    customerReportList: [],
    vendorReportList: [],
    inwardRegisterReportList: [],
    orderRegisterReportList: [],
    enquiryRegisterReportList: [],
    productInventoryList: [],
    stockInventoryDetailsList: [],
    stockInventoryLedgerList: [],
    categoryDropdownValues: [],
    subcategoryDropdownValues: [],
    productDropdownValues: [],
    vendorDropdownValues: [],
    customerDropdownValues: []
};

const CatalogReducer = function (state = initialState, action) {
    switch (action.type) {
        case GET_CUSTOMER_REPORT: {
            return {
                ...state,
                customerReportList: [...action.payload]
            };
        }
        case GET_VENDOR_REPORT: {
            return {
                ...state,
                vendorReportList: [...action.payload]
            };
        }
        case GET_INWARD_REGISTER_REPORT: {
            return {
                ...state,
                inwardRegisterReportList: [...action.payload]
            }
        }
        case GET_ORDER_REGISTER_REPORT: {
            return {
                ...state,
                orderRegisterReportList: [...action.payload]
            }
        }
        case GET_ENQUIRY_REGISTER_REPORT: {
            return {
                ...state,
                enquiryRegisterReportList: [...action.payload]
            }
        }
        case GET_PRODUCT_LIST_REPORT: {
            return {
                ...state,
                productInventoryList: [...action.payload]
            }
        }
        case GET_STOCK_DETAILS_REPORT: {
            return {
                ...state,
                stockInventoryDetailsList: [...action.payload]
            }
        }
        case GET_STOCK_LEDGER_REPORT: {
            return {
                ...state,
                stockInventoryLedgerList: [...action.payload]
            }
        }
        case GET_CATEGORY_DROPDOWN_VALUES: {
            return {
                ...state,
                categoryDropdownValues: [...action.payload]
            }
        }
        case GET_SUBCATEGORY_DROPDOWN_VALUES: {
            return {
                ...state,
                subcategoryDropdownValues: [...action.payload]
            }
        }
        case GET_PRODUCT_DROPDOWN_VALUES: {
            return {
                ...state,
                productDropdownValues: [...action.payload]
            }
        }
        case GET_VENDOR_DROPDOWN_VALUES: {
            return {
                ...state,
                vendorDropdownValues: [...action.payload]
            }
        }
        case GET_CUSTOMER_DROPDOWN_VALUES: {
            return {
                ...state,
                customerDropdownValues: [...action.payload]
            }
        }
        default: {
            return {
                ...state
            };
        }
    }
};

export default CatalogReducer;