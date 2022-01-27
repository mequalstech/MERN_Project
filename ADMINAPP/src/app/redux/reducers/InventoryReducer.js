import {
    GET_VENDOR,
    GET_INWARD,
    GET_ACTIVEVENDOR,
} from "../actions/InventoryActions";

const initialState = {
    vendorList: [],
    inwardList: [],
    vendorActiveList: [],
};

const InventoryReducer = function (state = initialState, action) {
    switch (action.type) {
        case GET_VENDOR:
            {
                return {
                    ...state,
                    vendorList: [...action.payload]
                };
            }
        case GET_INWARD:
            {
                return {
                    ...state,
                    inwardList: [...action.payload]
                };
            }
        case GET_ACTIVEVENDOR:
            {
                console.log(action, "../actions/inventoryyyyyy")
                return {
                    ...state,
                    vendorActiveList: action.payload
                };
            }
        default:
            {
                return {
                    ...state
                };
            }
    }
};

export default InventoryReducer;