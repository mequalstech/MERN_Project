import axios from "axios";
import { apiUrl } from "app/config";
import * as common from "app/services/common";

export const GET_VENDOR = "GET_VENDOR";
export const GET_ACTIVEVENDOR = "GET_ACTIVEVENDOR";
export const UPLOAD_VENDOR = "UPLOAD_VENDOR";
export const GET_INWARD = "GET_INWARD";

export const getVendorList = (loader) => dispatch => {
    if(loader)
        loader(true);

    axios.post(apiUrl + "vendor/list")
        .then(res => {
            var data = common.decryptJWT(res.data.token)
            dispatch({
                type: GET_VENDOR,
                payload: data.vendor
            });
            console.log(data.vendor);
        }).catch((e) => {
            console.log(e);
        }).finally(() => {
            if(loader)
                loader(false);
        });
};


export const updateVendorList = (data, toast, loader) => dispatch => {
    axios.post(apiUrl + "vendor/update", data)
        .then(res => {
            toast.success(
                res.data.message
            );
            dispatch(getVendorList(loader));
        }).catch((err) => {
            console.log(err);
            if(err.message!='Assignment to constant variable.'){
                toast.warning(
                    err.message
                );
            }
        });
};

export const deleteVendorList = (data, toast, loader) => dispatch => {
    console.log('loader', loader);
    axios.post(apiUrl + "vendor/delete", data)
        .then(res => {
            toast.success(
                res.data.message
            );
            dispatch(getVendorList(loader));
        }).catch((err) => {
            console.log(err);
            toast.warning(
                err.message
            );
        });
};

export const getVendorActiveList = () => dispatch => {
    axios.post("http://algrix.in:1430/vendor/activelist")
        .then(res => {
            var data = common.decryptJWT(res.data.token)
            dispatch({
                type: GET_ACTIVEVENDOR,
                payload: data
            });
        }).catch((e) => {
            console.log(e.message);
        });
};

export const uploadVendorList = (file) => dispatch => {
    axios.post("http://algrix.in:1430/uploadfile", { file: ''})
        .then(res => {
            dispatch({
                type: UPLOAD_VENDOR,
                payload: {}
            });
        }).catch((e) => {
            console.log(e.message);
        });
};


export const getInwardList = (loader) => dispatch => {
    if(loader)
        loader(true);

    axios.post(apiUrl + "purchase/list")
        .then(res => {
            var data = common.decryptJWT(res.data.token);

            dispatch({
                type: GET_INWARD,
                payload: data.purchase_data
            });
        }).catch((e) => {
            console.log(e);
        }).finally(() => {
            if(loader)
                loader(false);
        });
};