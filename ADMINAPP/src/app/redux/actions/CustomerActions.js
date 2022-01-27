import axios from "axios";
import { apiUrl } from "app/config";
import * as common from "app/services/common";

export const GET_CUSTOMER = "GET_CUSTOMER";
export const GET_CUSTOMERSHOP="GET_CUSTOMERSHOP";
export const GET_CUSTOMERBY_ID = "GET_CUSTOMERBY_ID";

export const getCustomer = () => dispatch => {
    axios
        .post(apiUrl + "member/customer")
        .then(res => {
            var data = common.decryptJWT(res.data.token, true)
            dispatch({
                type: GET_CUSTOMER,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};


export const getCustomershop = () => dispatch => {
    axios
        .post(apiUrl + "member/customer_shop")
        .then(res => {
            var data = common.decryptJWT(res.data.token, true)
            dispatch({
                type: GET_CUSTOMERSHOP,
                payload: data
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};




export const getCustomerById = (data, toast, openModal) => dispatch => {
    axios
        .post(apiUrl + "member/customer_by_id", data)
        .then(res => {
            var data = common.decryptJWT(res.data.token, true);
            openModal(true);
            dispatch({
                type: GET_CUSTOMERBY_ID,
                payload: data
            });
        })
        .catch((err) => {
            toast.warning(
                err.message
            );
        });
};



export const shopStatusUpdate = (data, toast) => dispatch => {
    axios
        .post(apiUrl + "member/update_address_status", data)
        .then(res => {
            toast.success(
                'Action Updated Successfully'
            );
            dispatch(getCustomershop());
        })
        .catch((err) => {
            toast.warning(
                err.message
            );
        });
};