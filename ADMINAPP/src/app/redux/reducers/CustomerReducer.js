import {
    GET_CUSTOMER,
    GET_CUSTOMERSHOP,
    GET_CUSTOMERBY_ID
} from "../actions/CustomerActions";

const initialState = {
    customerList: [],
    customershopList:[],
    customerById: []
};

const CustomerReducer = function (state = initialState, action) {
    switch (action.type) {
        case GET_CUSTOMER: {
            return {
                ...state,
                customerList: [...action.payload]
            };
        }
        case GET_CUSTOMERSHOP: {
            return {
                ...state,
                customershopList: [...action.payload]
            };
        }
        case GET_CUSTOMERBY_ID:{
            return {
                ...state,
                customerById: [...action.payload]
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
};



export default CustomerReducer;