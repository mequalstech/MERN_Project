import axios from "axios";
import { apiUrl } from "app/config";
import * as common from "app/services/common";

export const CHANGE_PASSWORD = "CHANGE_PASSWORD";

export const changePasswordAction = (formData, toast) => dispatch => {
    axios
        .post(apiUrl + "member/password_update", formData)
        .then(res => {
            var data = common.decryptJWT(res.data.token, true);
            toast.success(
                'Password Changed Successfully'
            );
            dispatch({
                type: CHANGE_PASSWORD,
                payload: data
            });
        })
        .catch((err) => {
            toast.warning(
                err.message
            );
        })
};


